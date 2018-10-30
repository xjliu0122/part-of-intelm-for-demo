const _ = require('lodash');
const Expo = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo.Expo();

module.exports = {
    send: async (pushToken, msg) => {
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.Expo.isExpoPushToken(pushToken)) {
            return;
        }
        const messages = [];
        messages.push({
            to: pushToken,
            sound: 'default',
            body: msg,
        });
        const chunks = expo.chunkPushNotifications(messages);
        if (_.size(chunks) > 0) {
            const chunk = chunks[0];
            try {
                await expo.sendPushNotificationsAsync(chunk);
            } catch (error) {
                console.error(error);
            }
        }
    },
};
