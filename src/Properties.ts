import type { Executable } from './'

import { resolve } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'

enum Property {
  ServerName = 'server-name',
  Gamemode = 'gamemode',
  ForceGamdemode = 'force-gamemode',
  Difficulty = 'difficulty',
  AllowCheats = 'allow-cheats',
  MaxPlayers = 'max-players',
  OnlineMode = 'online-mode',
  AllowList = 'allow-list',
  ServerPort = 'server-port',
  ServerPortV6 = 'server-portv6',
  EnableLanVisibility = 'enable-lan-visibility',
  ViewDistance = 'view-distance',
  TickDistance = 'tick-distance',
  PlayerIdleTimeout = 'player-idle-timeout',
  MaxThreads = 'max-threads',
  LevelName = 'level-name',
  LevelSeed = 'level-seed',
  DefaultPlayerPermissionLevel = 'default-player-permission-level',
  TexturepackRequired = 'texturepack-required',
  ContentLogFileEnabled = 'content-log-file-enabled',
  CompressionThreshold = 'compression-threshold',
  CompressionAlgorithm = 'compression-algorithm',
  ServerAuthoritativeMovement = 'server-authoritative-movement',
  PlayerMovementScoreThreshold = 'player-movement-score-threshold',
  PlayerMovementActionDirectionThreshold = 'player-movement-action-direction-threshold',
  PlayerMovementDistanceThreshold = 'player-movement-distance-threshold',
  PlayerMovementDurationThresholdInMs = 'player-movement-duration-threshold-in-ms',
  CorrectPlayerMovement = 'correct-player-movement',
  ServerAuthoritativeBlockBreaking = 'server-authoritative-block-breaking',
  ChatRestriction = 'chat-restriction',
  DisablePlayerInteraction = 'disable-player-interaction',
  ClientSideChunkGenerationEnabled = 'client-side-chunk-generation-enabled',
  BlockNetworkIdsAreHashes = 'block-network-ids-are-hashes',
  DisablePersona = 'disable-persona',
  DisableCustomSkins = 'disable-custom-skins',
  ServerBuildRadiusRatio = 'server-build-radius-ratio',
}

/**
 * @class **Properties of the server executable**
 * @description This class is used to get and set properties of the server executable.
 */
class Properties {
  private readonly executable: Executable
  private readonly properties: Map<string, string | number | boolean>
  private readonly file: string

  public constructor(executable: Executable) {
    this.executable = executable
    this.properties = new Map()
    this.file = readFileSync(resolve(executable.path, 'server.properties'), 'utf-8')
    const valueAndKeys = this.file.replace(/\r/g, '').split('\n').filter(line => !line.startsWith('#') && line !== '').map(line => line.split('='))
    for (const [key, value] of valueAndKeys) {
      if (value === 'true' || value === 'false') {
        this.properties.set(key, value === 'true')
      } else if (value.match(/^[0-9]+$/g)) {
        this.properties.set(key, Number(value))
      } else {
        this.properties.set(key, value)
      }
    }
  }

  public getProperty(key: Property): string | number | boolean {
    return this.properties.get(key)
  }

  public setProperty(key: Property, value: string | number | boolean): void {
    this.properties.set(key, value)
    const file = this.file.replace(new RegExp(`${key}=(.*)`, 'g'), `${key}=${value}`)
    writeFileSync(resolve(this.executable.path, 'server.properties'), file)
  }

  public getAllProperties(): { key: string, value: string | number | boolean}[] {
    return [...this.properties.entries()].map(([key, value]) => ({ key: Object.keys(Property).find((x) => Property[x] === key), value }))
  }

  public getServerName(): string {
    return this.getProperty(Property.ServerName) as string
  }

  public setServerName(name: string): void {
    this.setProperty(Property.ServerName, name)
  }

  public getGamemode(): string {
    return this.getProperty(Property.Gamemode) as string
  }

  public setGamemode(gamemode: string): void {
    this.setProperty(Property.Gamemode, gamemode)
  }

  public getForceGamemode(): boolean {
    return this.getProperty(Property.ForceGamdemode) as boolean
  }

  public setForceGamemode(force: boolean): void {
    this.setProperty(Property.ForceGamdemode, force)
  }

  public getDifficulty(): number {
    return this.getProperty(Property.Difficulty) as number
  }
  
  public setDifficulty(difficulty: number): void {
    this.setProperty(Property.Difficulty, difficulty)
  }

  public getAllowCheats(): boolean {
    return this.getProperty(Property.AllowCheats) as boolean
  }

  public setAllowCheats(allow: boolean): void {
    this.setProperty(Property.AllowCheats, allow)
  }

  public getMaxPlayers(): number {
    return this.getProperty(Property.MaxPlayers) as number
  }

  public setMaxPlayers(max: number): void {
    this.setProperty(Property.MaxPlayers, max)
  }

  public getOnlineMode(): boolean {
    return this.getProperty(Property.OnlineMode) as boolean
  }

  public setOnlineMode(online: boolean): void {
    this.setProperty(Property.OnlineMode, online)
  }
  
  public getAllowList(): string {
    return this.getProperty(Property.AllowList) as string
  }

  public setAllowList(allow: string): void {
    this.setProperty(Property.AllowList, allow)
  }

  public getServerPort(): number {
    return this.getProperty(Property.ServerPort) as number
  }

  public setServerPort(port: number): void {
    this.setProperty(Property.ServerPort, port)
  }

  public getServerPortV6(): number {
    return this.getProperty(Property.ServerPortV6) as number
  }

  public setServerPortV6(port: number): void {
    this.setProperty(Property.ServerPortV6, port)
  }

  public getViewDistance(): number {
    return this.getProperty(Property.ViewDistance) as number
  }

  public setViewDistance(distance: number): void {
    this.setProperty(Property.ViewDistance, distance)
  }

  public getTickDistance(): number {
    return this.getProperty(Property.TickDistance) as number
  }

  public setTickDistance(distance: number): void {
    this.setProperty(Property.TickDistance, distance)
  }

  public getPlayerIdleTimeout(): number {
    return this.getProperty(Property.PlayerIdleTimeout) as number
  }

  public setPlayerIdleTimeout(timeout: number): void {
    this.setProperty(Property.PlayerIdleTimeout, timeout)
  }

  public getMaxThreads(): number {
    return this.getProperty(Property.MaxThreads) as number
  }

  public setMaxThreads(threads: number): void {
    this.setProperty(Property.MaxThreads, threads)
  }

  public getLevelName(): string {
    return this.getProperty(Property.LevelName) as string
  }

  public setLevelName(name: string): void {
    this.setProperty(Property.LevelName, name)
  }

  public getLevelSeed(): string {
    return this.getProperty(Property.LevelSeed) as string
  }

  public setLevelSeed(seed: string): void {
    this.setProperty(Property.LevelSeed, seed)
  }

  public getDefaultPlayerPermissionLevel(): number {
    return this.getProperty(Property.DefaultPlayerPermissionLevel) as number
  }

  public setDefaultPlayerPermissionLevel(level: number): void {
    this.setProperty(Property.DefaultPlayerPermissionLevel, level)
  }

  public getTexturepackRequired(): boolean {
    return this.getProperty(Property.TexturepackRequired) as boolean
  }

  public setTexturepackRequired(required: boolean): void {
    this.setProperty(Property.TexturepackRequired, required)
  }

  public getContentLogFileEnabled(): boolean {
    return this.getProperty(Property.ContentLogFileEnabled) as boolean
  }

  public setContentLogFileEnabled(enabled: boolean): void {
    this.setProperty(Property.ContentLogFileEnabled, enabled)
  }

  public getCompressionThreshold(): number {
    return this.getProperty(Property.CompressionThreshold) as number
  }

  public setCompressionThreshold(threshold: number): void {
    this.setProperty(Property.CompressionThreshold, threshold)
  }

  public getCompressionAlgorithm(): number {
    return this.getProperty(Property.CompressionAlgorithm) as number
  }

  public setCompressionAlgorithm(algorithm: number): void {
    this.setProperty(Property.CompressionAlgorithm, algorithm)
  }

  public getServerAuthoritativeMovement(): boolean {
    return this.getProperty(Property.ServerAuthoritativeMovement) as boolean
  }

  public setServerAuthoritativeMovement(authoritative: boolean): void {
    this.setProperty(Property.ServerAuthoritativeMovement, authoritative)
  }

  public getPlayerMovementScoreThreshold(): number {
    return this.getProperty(Property.PlayerMovementScoreThreshold) as number
  }

  public setPlayerMovementScoreThreshold(threshold: number): void {
    this.setProperty(Property.PlayerMovementScoreThreshold, threshold)
  }

  public getPlayerMovementActionDirectionThreshold(): number {
    return this.getProperty(Property.PlayerMovementActionDirectionThreshold) as number
  }

  public setPlayerMovementActionDirectionThreshold(threshold: number): void {
    this.setProperty(Property.PlayerMovementActionDirectionThreshold, threshold)
  }

  public getPlayerMovementDistanceThreshold(): number {
    return this.getProperty(Property.PlayerMovementDistanceThreshold) as number
  }

  public setPlayerMovementDistanceThreshold(threshold: number): void {
    this.setProperty(Property.PlayerMovementDistanceThreshold, threshold)
  }

  public getPlayerMovementDurationThresholdInMs(): number {
    return this.getProperty(Property.PlayerMovementDurationThresholdInMs) as number
  }

  public setPlayerMovementDurationThresholdInMs(threshold: number): void {
    this.setProperty(Property.PlayerMovementDurationThresholdInMs, threshold)
  }

  public getCorrectPlayerMovement(): boolean {
    return this.getProperty(Property.CorrectPlayerMovement) as boolean
  }

  public setCorrectPlayerMovement(correct: boolean): void {
    this.setProperty(Property.CorrectPlayerMovement, correct)
  }

  public getServerAuthoritativeBlockBreaking(): boolean {
    return this.getProperty(Property.ServerAuthoritativeBlockBreaking) as boolean
  }

  public setServerAuthoritativeBlockBreaking(authoritative: boolean): void {
    this.setProperty(Property.ServerAuthoritativeBlockBreaking, authoritative)
  }

  public getChatRestriction(): number {
    return this.getProperty(Property.ChatRestriction) as number
  }

  public setChatRestriction(restriction: number): void {
    this.setProperty(Property.ChatRestriction, restriction)
  }

  public getDisablePlayerInteraction(): boolean {
    return this.getProperty(Property.DisablePlayerInteraction) as boolean
  }

  public setDisablePlayerInteraction(disable: boolean): void {
    this.setProperty(Property.DisablePlayerInteraction, disable)
  }

  public getClientSideChunkGenerationEnabled(): boolean {
    return this.getProperty(Property.ClientSideChunkGenerationEnabled) as boolean
  }

  public setClientSideChunkGenerationEnabled(enabled: boolean): void {
    this.setProperty(Property.ClientSideChunkGenerationEnabled, enabled)
  }

  public getBlockNetworkIdsAreHashes(): boolean {
    return this.getProperty(Property.BlockNetworkIdsAreHashes) as boolean
  }

  public setBlockNetworkIdsAreHashes(areHashes: boolean): void {
    this.setProperty(Property.BlockNetworkIdsAreHashes, areHashes)
  }

  public getDisablePersona(): boolean { 
    return this.getProperty(Property.DisablePersona) as boolean
  }

  public setDisablePersona(disable: boolean): void {
    this.setProperty(Property.DisablePersona, disable)
  }

  public getDisableCustomSkins(): boolean {
    return this.getProperty(Property.DisableCustomSkins) as boolean
  }

  public setDisableCustomSkins(disable: boolean): void {
    this.setProperty(Property.DisableCustomSkins, disable)
  }

  public getServerBuildRadiusRatio(): number {
    return this.getProperty(Property.ServerBuildRadiusRatio) as number
  }

  public setServerBuildRadiusRatio(ratio: number): void {
    this.setProperty(Property.ServerBuildRadiusRatio, ratio)
  }
}

export {
  Properties,
  Property,
}