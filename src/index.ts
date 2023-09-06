import { EventEmitter } from 'node:events'
import { resolve } from 'node:path'
import { spawn, ChildProcess } from 'node:child_process'
import { Properties } from './Properties'

import type { ExecutableEvents, ConsoleEvent } from './types'

interface Executable {
  on<K extends keyof ExecutableEvents>(event: K, callback: (...args: ExecutableEvents[K]) => void): this
  on<S extends string | symbol>(
    event: Exclude<S, keyof ExecutableEvents>,
    callback: (...args: unknown[]) => void,
  ): this
  once<K extends keyof ExecutableEvents>(event: K, callback: (...args: ExecutableEvents[K]) => void): this
  once<S extends string | symbol>(
    event: Exclude<S, keyof ExecutableEvents>,
    callback: (...args: unknown[]) => void,
  ): this
  emit<K extends keyof ExecutableEvents>(event: K, ...args: ExecutableEvents[K]): boolean
  emit<S extends string | symbol>(
    event: Exclude<S, keyof ExecutableEvents>,
    ...args: unknown[]
  ): boolean
}

/**
 * @class **Executable**
 * @extends EventEmitter
 * @description Represents the server executable file.
 */
class Executable extends EventEmitter {
  public readonly path: string
  public readonly process: ChildProcess
  public readonly properties: Properties

  private cache: string = undefined

  public constructor(path: string) {
    super()
    this.path = path.split('\\').slice(0, -1).join('\\')
    this.process = spawn(resolve(path))
    this.properties = new Properties(this)
    this.process.stdout.on('data', this.processStdout.bind(this))
    this.process.stderr.on('data', this.processStderr.bind(this))
    this.process.on('spawn', () => this.emit('opened'))
    this.process.on('close', (code, signal) => this.emit('closed'))
  }

  public writeBuffer(data: Buffer): void {
    this.process.stdin.write(data + '\n')
  } 

  public writeString(data: string): void {
    this.process.stdin.write(data + '\n')
  }

  private processStderr(buffer: Buffer): string | void {
    this.emit('stderr', buffer.toString('utf-8'))
  }

  private processStdout(buffer: Buffer): string | void {
    const string = buffer.toString('utf-8')
    if (!this.cache && !string.endsWith('\r\n')) {
      return this.cache = string
    } else if (this.cache && !string.endsWith('\r\n')) {
      const line = (this.cache + string)

      return this.cache = line
    } else if (this.cache && string.endsWith('\r\n')) {
      const line = (this.cache + string)
      this.processConsole(line)
      this.emit('stdout', line)

      return this.cache = undefined
    } else {
      this.processConsole(string)
      this.emit('stdout', string)
    }
  }

  private processConsole(data: string): void {
    const parsed = data.split('\r\n')
    for (const line of parsed) {
      if (line === '' || line === ':r') continue
      const timestamp = line.match(/\[(.*?)\]/g)
      if (!timestamp) {
        this.emit('console', {
          line,
          date: undefined,
          time: undefined,
          meta: undefined,
        })
      } else {
        const message = line.replace(`${timestamp?.slice(0, 3).join(' ')} `, '')
        const meta = (timestamp as string[]).map((data) => data.replace(/\[|\]/g, '').toLocaleLowerCase())
        const event = {
          line: message,
          date: meta[0].split(' ')[0],
          time: meta[0].split(' ')[1],
          meta: [ meta[0].split(' ')[2] ],
        } as ConsoleEvent
        if (meta.length > 1) {
          meta.forEach((data, index) => {
              if (index === 0) return
      
              return event.meta.push(data)
          })
        }

        this.emit('console', event)
      }
    }
  }
}

export {
  Executable,
}
