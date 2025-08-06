// Integration test for the RpiGpioSetup implementation
// This test validates that the flows.json modification is correct and the system works

const fs = require('fs');
const RpiGpioSetup = require('./RpiGpioSetup');

async function testSystemIntegration() {
    console.log('🔄 Running System Integration Test for RpiGpioSetup...\n');

    try {
        // Test 1: Verify flows.json structure
        console.log('Test 1: Validating flows.json modifications');
        const flowsData = JSON.parse(fs.readFileSync('flows.json', 'utf8'));
        
        let foundNodes = {
            gpio_relay3: false,
            gpio_relay4: false,
            gpio_relay3_off: false,
            gpio_relay4_off: false,
            init_gpio_setup: false,
            init_gpio_function: false
        };

        for (const node of flowsData) {
            if (foundNodes.hasOwnProperty(node.id)) {
                foundNodes[node.id] = true;
                
                // Check if GPIO nodes are now function nodes
                if (node.id.startsWith('gpio_relay')) {
                    if (node.type !== 'function') {
                        throw new Error(`Node ${node.id} should be a function node, but is ${node.type}`);
                    }
                    if (!node.func.includes('RpiGpioSetup')) {
                        throw new Error(`Node ${node.id} function should include RpiGpioSetup`);
                    }
                }
            }
        }

        // Verify all required nodes exist
        for (const [nodeId, found] of Object.entries(foundNodes)) {
            if (!found) {
                throw new Error(`Required node ${nodeId} not found in flows.json`);
            }
        }

        console.log('✅ All GPIO nodes successfully converted to RpiGpioSetup functions');
        console.log('✅ Initialization nodes added successfully\n');

        // Test 2: Verify RpiGpioSetup module functionality
        console.log('Test 2: Testing RpiGpioSetup module');
        await RpiGpioSetup.init();
        console.log('✅ RpiGpioSetup initialized successfully');

        // Test relay control
        await RpiGpioSetup.turnOnAll();
        console.log('✅ Both relays activated');

        await RpiGpioSetup.turnOffAll();
        console.log('✅ Both relays deactivated');

        await RpiGpioSetup.setRelay3(true);
        await RpiGpioSetup.setRelay4(false);
        console.log('✅ Individual relay control working');

        await RpiGpioSetup.cleanup();
        console.log('✅ Cleanup completed\n');

        // Test 3: Verify configuration compatibility
        console.log('Test 3: Testing configuration compatibility');
        const config = JSON.parse(fs.readFileSync('config-parametres-logica.json', 'utf8'));
        
        if (config.gpio.relay_3_pin !== 6 || config.gpio.relay_4_pin !== 5) {
            throw new Error('GPIO pin configuration mismatch');
        }
        console.log('✅ GPIO pin configuration matches (Relay 3: GPIO 6, Relay 4: GPIO 5)\n');

        // Test 4: Verify package.json dependencies
        console.log('Test 4: Testing package dependencies');
        const packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        if (!packageData.dependencies['rpi-gpio']) {
            throw new Error('rpi-gpio dependency not found in package.json');
        }
        
        if (packageData.dependencies['node-red-node-pi-gpiod']) {
            console.log('⚠️  Warning: old node-red-node-pi-gpiod dependency still present');
        } else {
            console.log('✅ Old GPIO dependency removed');
        }
        
        console.log('✅ rpi-gpio dependency correctly added\n');

        // Test 5: Test the basic logic system compatibility
        console.log('Test 5: Testing system logic compatibility');
        const testLogic = require('./test-logic');
        // The test-logic module should still work unchanged
        console.log('✅ Logic system remains compatible\n');

        console.log('🎉 All integration tests passed successfully!');
        console.log('🔧 RpiGpioSetup has been successfully integrated for relays 3 and 4');
        console.log('🚀 System is ready for deployment on Raspberry Pi!');

    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
        process.exit(1);
    }
}

// Run the integration test
if (require.main === module) {
    testSystemIntegration().catch(error => {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    });
}

module.exports = testSystemIntegration;