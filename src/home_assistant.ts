import { Client } from "./mqtt"
import { TargetConfig } from "./types"
import { md5, slugify, sanitize } from "./util"

export const createHomeAssistantTopics = async (
  mqtt: Client,
  targets: Array<TargetConfig>,
  prefix: string,
  version: string,
) => {
  const promises = []

  for (const target of targets) {
    const device: any = {
      name: target.name ?? target.host,
      identifiers: target.host,
    }

    if (target.device_manufacturer) {
      device.manufacturer = target.device_manufacturer
    }
    if (target.device_model) {
      device.model = target.device_model
    }
    if (target.suggested_area) {
      device.suggested_area = target.suggested_area
    }
    if (target.mac) {
      device.connections = [["mac", target.mac]]
    }

    const origin: any = {
      name: "SNMP2MQTT",
      sw_version: target.host,
      url: "https://github.com/andrewjswan/snmp2mqtt",
    }

    for (const sensor of target.sensors) {
      const sensorType = sensor.binary_sensor ? "binary_sensor" : "sensor"
      const sensorName = slugify(sensor.name)
      const topic = `${prefix}/${sensorType}/snmp2mqtt/${target.name ? sanitize(target.name) : sanitize(target.host)}_${sensorName}/config`

      const discovery: any = {
        device,
        origin,
        name: sensor.name,
        unique_id: `snmp2mqtt.${md5(`${target.host}-${sensor.oid}`)}`,
        state_topic: mqtt.sensorValueTopic(sensor, target),
        qos: mqtt.qos,
      }

      if (sensor.availability_mode) {
        if (sensor.availability_mode !== "online")
        {
          discovery.availability = [
            {
              topic: mqtt.STATUS_TOPIC,
            },
            {
              topic: mqtt.sensorStatusTopic(sensor, target),
            },
          ]
          discovery.availability_mode = sensor.availability_mode
        }
      }
      if (sensor.template) {
        discovery.value_template = sensor.template
      }
      if (sensor.unit_of_measurement) {
        discovery.unit_of_measurement = sensor.unit_of_measurement
      }
      if (sensor.device_class) {
        discovery.device_class = sensor.device_class
      }
      if (sensor.entity_category) {
        discovery.entity_category = sensor.entity_category
      }
      if (sensor.icon) {
        discovery.icon = sensor.icon
      }

      promises.push(mqtt.publish(topic, discovery))
    }
  }

  await Promise.all(promises)
}
