interface ExecutableEvents {
  stdout: [string]
  stderr: [string]
  opened: []
  closed: []
  console: [ConsoleEvent]
}

interface ConsoleEvent {
  readonly line: string
  readonly date: string
  readonly time: string
  readonly meta: string[]
}

export {
  ExecutableEvents,
  ConsoleEvent,
}
