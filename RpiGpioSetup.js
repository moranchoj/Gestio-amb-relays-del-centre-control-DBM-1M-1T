/**
 * RpiGpioSetup - Module for controlling relays 3 and 4 using rpi-gpio
 * This module provides GPIO control functionality for the DBM pump control system
 */

/**
 * RpiGpioSetup - Module for controlling relays 3 and 4 using rpi-gpio
 * This module provides GPIO control functionality for the DBM pump control system
 */

let gpio;
let isMockMode = false;

// Check if we're on a Raspberry Pi
try {
    const fs = require('fs');
    const cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf8');
    
    if (cpuinfo.includes('Raspberry Pi')) {
        gpio = require('rpi-gpio');
    } else {
        throw new Error('Not on Raspberry Pi');
    }
} catch (error) {
    // Mock GPIO for testing on non-Raspberry Pi systems
    isMockMode = true;
    console.log('RpiGpioSetup: Running in mock mode (not on Raspberry Pi)');
    gpio = {
        DIR_OUT: 'out',
        setup: (pin, direction, callback) => {
            setTimeout(() => {
                console.log(`Mock GPIO: Setup pin ${pin} as ${direction}`);
                callback(null);
            }, 10);
        },
        write: (pin, value, callback) => {
            setTimeout(() => {
                console.log(`Mock GPIO: Write pin ${pin} = ${value}`);
                callback(null);
            }, 10);
        },
        destroy: () => {
            console.log('Mock GPIO: Destroyed');
        }
    };
}

class RpiGpioSetup {
    constructor() {
        this.relay3Pin = 6;  // GPIO 6 for relay 3
        this.relay4Pin = 5;  // GPIO 5 for relay 4
        this.initialized = false;
    }

    /**
     * Initialize GPIO pins for relay control
     */
    async init() {
        if (this.initialized) {
            return;
        }

        try {
            // Setup GPIO pins as outputs
            await new Promise((resolve, reject) => {
                gpio.setup(this.relay3Pin, gpio.DIR_OUT, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            await new Promise((resolve, reject) => {
                gpio.setup(this.relay4Pin, gpio.DIR_OUT, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Set initial state to OFF (HIGH for active low relays)
            await this.setRelay3(false);
            await this.setRelay4(false);

            this.initialized = true;
            console.log(`RpiGpioSetup: GPIO pins initialized for relays 3 and 4 ${isMockMode ? '(mock mode)' : ''}`);
        } catch (error) {
            console.error('RpiGpioSetup: Failed to initialize GPIO pins:', error);
            throw error;
        }
    }

    /**
     * Control relay 3 (GPIO 6)
     * @param {boolean} state - true to activate relay, false to deactivate
     */
    async setRelay3(state) {
        try {
            // Active low logic: false/0 = relay ON, true/1 = relay OFF
            const gpioValue = state ? false : true;
            
            await new Promise((resolve, reject) => {
                gpio.write(this.relay3Pin, gpioValue, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            console.log(`RpiGpioSetup: Relay 3 (GPIO ${this.relay3Pin}) set to ${state ? 'ON' : 'OFF'}`);
        } catch (error) {
            console.error(`RpiGpioSetup: Failed to set relay 3:`, error);
            throw error;
        }
    }

    /**
     * Control relay 4 (GPIO 5)
     * @param {boolean} state - true to activate relay, false to deactivate
     */
    async setRelay4(state) {
        try {
            // Active low logic: false/0 = relay ON, true/1 = relay OFF
            const gpioValue = state ? false : true;
            
            await new Promise((resolve, reject) => {
                gpio.write(this.relay4Pin, gpioValue, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            console.log(`RpiGpioSetup: Relay 4 (GPIO ${this.relay4Pin}) set to ${state ? 'ON' : 'OFF'}`);
        } catch (error) {
            console.error(`RpiGpioSetup: Failed to set relay 4:`, error);
            throw error;
        }
    }

    /**
     * Control both relays simultaneously
     * @param {boolean} relay3State - state for relay 3
     * @param {boolean} relay4State - state for relay 4
     */
    async setRelays(relay3State, relay4State) {
        await Promise.all([
            this.setRelay3(relay3State),
            this.setRelay4(relay4State)
        ]);
    }

    /**
     * Turn off both relays
     */
    async turnOffAll() {
        await this.setRelays(false, false);
    }

    /**
     * Turn on both relays (pump operation)
     */
    async turnOnAll() {
        await this.setRelays(true, true);
    }

    /**
     * Cleanup GPIO resources
     */
    async cleanup() {
        if (this.initialized) {
            try {
                await this.turnOffAll();
                gpio.destroy();
                this.initialized = false;
                console.log('RpiGpioSetup: GPIO cleanup completed');
            } catch (error) {
                console.error('RpiGpioSetup: Error during cleanup:', error);
            }
        }
    }
}

// Export singleton instance
module.exports = new RpiGpioSetup();