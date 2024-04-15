# snmp2mqtt

## General

[![snmp2mqtt](https://img.shields.io/badge/SNMP-MQTT-blue.svg)](https://github.com/andrewjswan/snmp2mqtt/)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/andrewjswan/snmp2mqtt/build.yml?logo=github)](https://github.com/andrewjswan/snmp2mqtt/actions)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/andrewjswan/snmp2mqtt)](https://github.com/andrewjswan/snmp2mqtt/pkgs/container/snmp2mqtt)
[![GitHub](https://img.shields.io/github/license/andrewjswan/snmp2mqtt-addon?color=blue)](https://github.com/andrewjswan/snmp2mqtt/blob/master/LICENSE)
[![StandWithUkraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/badges/StandWithUkraine.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

Expose SNMP sensors to MQTT with Home Assistant support.

## config.yml

```yaml
log: debug # Optional: debug, info, warning or error (default: info)

mqtt:
    host: 192.168.1.5 # Optional: broker URL or IP address (default: localhost)
    port: 1884 # Optional: broker port (default: 1883 or 8883 for TLS connections)
    username: my_user # Optional: broker user (default: none)
    password: my_password # Optional: broker password (default: none)
    client_id: snmp2mqtt # Optional: client ID (default: snmp2mqtt)
    keepalive: 30 # Optional: keepalive in seconds (default: 10)
    clean: true # Optional: clean session (default: true)
    retain: true # Optional: retain (default: true)
    qos: 2 # Optional: QoS (default: 0)
    base_topic: # Optional: the base level of the topic (default: snmp2mqtt)
    host_name_as_target: true # Optional: Use the target's name instead of the host as the MQTT topic (default: false)
    ca: /cert/ca.pem # Optional: CA for TLS connection (default: none)
    cert: /cert/cert.pem # Optional: certificate for TLS connection (default: none)
    key: /cert/key.pem # Optional: private key for TLS connection (default: none)
    reject_unauthorized: true # Optional: if not false, the server certificate is verified against the list of supplied CAs. Override with caution (default: true when using TLS)

homeassistant:
    discovery: true # Optional: enable Home Assistant discovery (default: false)
    prefix: "home-assistant" # Optional: Home Assistant MQTT topic prefix (default: homeassistant)

targets:
    - host: 192.168.0.2 # Required: target IP address
      name: Raspberry Pi # Optional: target name
      mac: 00:00:00:00:00:00 # Optional: mac adress
      scan_interval: 30 # Optional: fetch interval in seconds (default: 10)
      device_manufacturer: Raspberry Pi # Optional: set the device manufacturer in Home Assistant
      device_model: 3 Model B # Optional: set the device model in Home Assistant
      suggested_area: Bedroom # Optional: set the area in Home Assistant
      auth_key: password # Optional: set the auth password for SNMPv3
      auth_protocol: sha # Optional: set the auth protocol for SNMPv3, one of sha or md5
      priv_key: password # Optional: set the privilege password for SNMPv3
      priv_protocol: des # Optional: set the privilege protocol for SNMPv3, one of des, aes, aes256b or aes256r
      version: "3" # Optional: 1, 2c or 3 (default: 1)
      sensors:
          - oid: 1.3.6.1.2.1.25.1.1.0 # Required: SNMP oid
            name: Raspberry Pi Uptime # Required: sensor name
            unit_of_measurement: days # Optional: set the unit of measurement in Home Assistant
            transform: "value / 6000" # Optional: a transform function written in JavaScript
            template: "{{ value | float(0) / 6000 }}" # Optional: a HA template to get the state of the sensor (Used for Discovery).
            icon: mdi:calendar-clock # Optional: set an icon in Home Assistant
            device_class: temperature # Optional: set the Home Assistant class of the device.
            entity_category: diagnostic # Optional: set the Home Assistant entity category.
            binary_sensor: false # Optional: whether to expose the sensor as a binary sensor in Home Assistant

    - host: 192.168.0.3
      name: Raspberry Pi 2
      version: 2c
      sensors:
          - oid: 1.3.6.1.2.1.25.1.1.0
            name: Raspberry Pi 2 Uptime
            unit_of_measurement: days
            transform: "Math.floor(value / 6000 / 60 / 24)"
            icon: mdi:calendar-clock

          - oid: 1.3.6.1.4.1.2021.11.11.0
            name: Raspberry Pi 2 CPU
            unit_of_measurement: "%"
            transform: "100 - value"
            icon: mdi:cpu-64-bit
```

## Running the app

The easiest way to run the app is via Docker Compose, e.g.

```yaml
version: "3"
services:
    snmp2mqtt:
        container_name: snmp2mqtt
        image: dchesterton/snmp2mqtt:latest
        restart: unless-stopped
        volumes:
            - ./config.yml:/app/config.yml
```

## Notes

Based on https://github.com/dchesterton/snmp2mqtt
