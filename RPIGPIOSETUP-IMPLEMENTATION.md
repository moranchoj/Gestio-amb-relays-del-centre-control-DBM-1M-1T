# RpiGpioSetup Implementation

This document describes the implementation of RpiGpioSetup for controlling relays 3 and 4 in the DBM pump control system.

## Changes Made

### 1. Package Dependencies
- **Removed**: `node-red-node-pi-gpiod` (problematic dependency)
- **Added**: `rpi-gpio` v2.1.7 (reliable GPIO control library)

### 2. New Module: RpiGpioSetup.js
A new GPIO control module that provides:
- **GPIO Pin Control**: Direct control of GPIO pins 6 and 5 for relays 3 and 4
- **Active-Low Logic**: Implements correct relay control (LOW = ON, HIGH = OFF)
- **Async/Await Support**: Modern Promise-based API
- **Mock Mode**: Automatic fallback for non-Raspberry Pi environments
- **Error Handling**: Comprehensive error handling and logging
- **Singleton Pattern**: Single instance for consistent state management

#### Key Methods:
- `init()` - Initialize GPIO pins
- `setRelay3(state)` - Control relay 3 (GPIO 6)
- `setRelay4(state)` - Control relay 4 (GPIO 5)
- `setRelays(relay3State, relay4State)` - Control both relays
- `turnOnAll()` - Activate both relays
- `turnOffAll()` - Deactivate both relays
- `cleanup()` - Clean shutdown

### 3. Node-RED Flow Modifications
Replaced 4 `rpi-gpio out` nodes with `function` nodes:
- **gpio_relay3**: Now uses `RpiGpioSetup.setRelay3(true)`
- **gpio_relay4**: Now uses `RpiGpioSetup.setRelay4(true)`
- **gpio_relay3_off**: Now uses `RpiGpioSetup.setRelay3(false)`
- **gpio_relay4_off**: Now uses `RpiGpioSetup.setRelay4(false)`

### 4. Initialization System
Added automatic initialization:
- **init_gpio_setup**: Inject node that runs on startup
- **init_gpio_function**: Function node that initializes RpiGpioSetup

### 5. Testing Framework
Created comprehensive test suite:
- **test-RpiGpioSetup.js**: Unit tests for the GPIO module
- **test-integration.js**: Full system integration tests

## Benefits

### 1. **Reliability**
- Eliminates dependency on problematic `node-red-node-pi-gpiod` package
- Uses well-maintained `rpi-gpio` library
- Proper error handling and recovery

### 2. **Maintainability**
- Clean, documented code
- Centralized GPIO control logic
- Easy to extend for additional relays

### 3. **Compatibility**
- Maintains all existing functionality
- No changes to configuration files
- No disruption to other system components

### 4. **Testing**
- Works in development environments (mock mode)
- Comprehensive test coverage
- Easy to validate functionality

## GPIO Pin Configuration

| Relay | GPIO Pin | Function |
|-------|----------|----------|
| Relay 3 | GPIO 6 | Pump control |
| Relay 4 | GPIO 5 | Pump control |

**Logic**: Active LOW (0 = relay closed/ON, 1 = relay open/OFF)

## Backwards Compatibility

✅ **Maintained**:
- Configuration file format (`config-parametres-logica.json`)
- Node-RED flow structure
- MQTT communication
- Dashboard functionality
- Historical data logging
- Email notifications

❌ **Changed**:
- GPIO node implementation (internal only)
- Package dependencies

## Testing Results

All tests pass successfully:
- ✅ GPIO control functionality
- ✅ Node-RED flow validation
- ✅ System logic compatibility
- ✅ Configuration compatibility
- ✅ Package dependency management

## Deployment Notes

1. **Installation**: Run `npm install` to install new dependencies
2. **Testing**: Use `node test-integration.js` to validate installation
3. **Mock Mode**: System automatically detects non-Raspberry Pi environments
4. **Real Hardware**: Full functionality available on Raspberry Pi with GPIO support

## Files Modified

- `package.json` - Updated dependencies
- `flows.json` - Replaced GPIO nodes with RpiGpioSetup functions
- `RpiGpioSetup.js` - New GPIO control module (added)
- `test-RpiGpioSetup.js` - Unit tests (added)
- `test-integration.js` - Integration tests (added)

## Files Unchanged

- `config-parametres-logica.json` - Configuration remains the same
- `test-logic.js` - Business logic tests unchanged
- `README.md` - Documentation unchanged
- `INSTALACIO.md` - Installation guide unchanged
- All other system files remain unchanged