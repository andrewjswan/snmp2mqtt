import { LogLevelStrings } from "./log"

export interface MQTTConfig {
  host: string
  port?: number
  username?: string
  password?: string
  retain: boolean
  qos: 0 | 1 | 2
  client_id?: string
  keepalive?: number
  base_topic?: string
  host_name_as_target?: boolean
  ca?: string
  cert?: string
  key?: string
  clean: boolean
  reject_unauthorized?: boolean
}

export interface TargetConfig {
  host: string
  mac?: string
  sensors: SensorConfig[]
  name?: string
  device_manufacturer?: string
  device_model?: string
  suggested_area?: string
  community?: string
  version?: VersionConfig
  port?: number
  scan_interval?: number
  username?: string
  auth_protocol?: "md5" | "sha"
  auth_key?: string
  priv_protocol?: "des" | "aes" | "aes256b" | "aes256r"
  priv_key?: string
}

export type VersionConfig = "1" | 1 | "2c" | 3 | "3"

export interface SensorConfig {
  oid: string
  name: string
  transform?: string
  template?: string
  unit_of_measurement?: string
  device_class?: string
  entity_category?: string
  icon?: string
  binary_sensor?: boolean
}

export interface Config {
  log: LogLevelStrings
  mqtt: MQTTConfig
  homeassistant: HomeAssistantConfig
  targets: Array<TargetConfig>
}

export interface HomeAssistantConfig {
  discovery: boolean
  prefix: string
}
