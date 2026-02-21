# RackReady Integration Overview

## What it is
RackReady is a rack simulation + bar-loading guidance module.

## Inputs
- unit: lb/kg
- barWeight
- targetTotal
- plateInventory (denominations + counts)
- currentConfig (optional)

## Outputs
- per-side plate breakdown
- total loaded weight
- add/remove transition instructions
- visual representation (UI)

## MVP Screens
- Rack view (inventory + suggestion)
- Bar view (loaded plates + total)
- Transition view (add/remove)