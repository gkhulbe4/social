"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationId = getConversationId;
function getConversationId(user1, user2) {
    return [user1, user2].sort().join(":");
}
//# sourceMappingURL=getConversationId.js.map