// Test script for RpiGpioSetup module
// This script tests the GPIO relay control functionality

const RpiGpioSetup = require('./RpiGpioSetup');

async function testRpiGpioSetup() {
    console.log('🧪 Testing RpiGpioSetup module...\n');

    try {
        // Test 1: Initialize GPIO
        console.log('Test 1: Initialize GPIO');
        await RpiGpioSetup.init();
        console.log('✅ GPIO initialization successful\n');

        // Test 2: Turn on relay 3
        console.log('Test 2: Turn on relay 3');
        await RpiGpioSetup.setRelay3(true);
        console.log('✅ Relay 3 activated\n');

        // Test 3: Turn on relay 4
        console.log('Test 3: Turn on relay 4');
        await RpiGpioSetup.setRelay4(true);
        console.log('✅ Relay 4 activated\n');

        // Test 4: Turn on both relays
        console.log('Test 4: Turn on both relays');
        await RpiGpioSetup.turnOnAll();
        console.log('✅ Both relays activated\n');

        // Test 5: Turn off relay 3
        console.log('Test 5: Turn off relay 3');
        await RpiGpioSetup.setRelay3(false);
        console.log('✅ Relay 3 deactivated\n');

        // Test 6: Turn off relay 4
        console.log('Test 6: Turn off relay 4');
        await RpiGpioSetup.setRelay4(false);
        console.log('✅ Relay 4 deactivated\n');

        // Test 7: Turn off all relays
        console.log('Test 7: Turn off all relays');
        await RpiGpioSetup.turnOffAll();
        console.log('✅ All relays deactivated\n');

        // Test 8: Set specific relay states
        console.log('Test 8: Set specific relay states (R3=ON, R4=OFF)');
        await RpiGpioSetup.setRelays(true, false);
        console.log('✅ Relays set to specific states\n');

        // Final cleanup
        console.log('Cleanup: Turn off all relays');
        await RpiGpioSetup.cleanup();
        console.log('✅ Cleanup completed\n');

        console.log('✅ All RpiGpioSetup tests passed successfully!');
        console.log('🚀 RpiGpioSetup module is ready for integration!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        
        // Attempt cleanup on error
        try {
            await RpiGpioSetup.cleanup();
        } catch (cleanupError) {
            console.error('❌ Cleanup also failed:', cleanupError.message);
        }
        
        process.exit(1);
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    testRpiGpioSetup().catch(error => {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    });
}

module.exports = testRpiGpioSetup;