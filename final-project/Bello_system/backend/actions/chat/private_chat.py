from flask import Blueprint, jsonify, request
from DB_utils import DatabaseManager
from jwt_utils import require_auth

private_chat = Blueprint("private_chat", __name__)

@private_chat.route('/my-chats/<user_id>', methods=['GET', 'OPTIONS'])
@require_auth
def get_chat_list(user_id):
    # 驗證請求的 user_id 與 token 中的 user_id 一致
    if request.current_user['user_id'] != int(user_id):
        return jsonify({
            'status': 'error',
            'message': '無權限訪問'
        }), 403
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        db = DatabaseManager()
        chats = db.get_user_chat_list(user_id)
        
        if chats is not None:
            return jsonify({
                'status': 'success',
                'chats': chats
            })
        
        return jsonify({
            'status': 'error',
            'message': '獲取聊天列表失敗'
        }), 500
        
    except Exception as e:
        print(f"Error getting chat list: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@private_chat.route('/private-chat/history', methods=['POST', 'OPTIONS'])
@require_auth
def get_chat_history():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.get_json()
        # 從 JWT token 獲取當前用戶 ID
        current_user_id = request.current_user['user_id']
        user1_id = data.get('user1_id')
        user2_id = data.get('user2_id')
        
        # 驗證當前用戶是聊天的一方
        if current_user_id not in [user1_id, user2_id]:
            return jsonify({
                'status': 'error',
                'message': '無權限訪問此聊天記錄'
            }), 403
        
        if not all([user1_id, user2_id]):
            return jsonify({
                'status': 'error',
                'message': '缺少必要參數'
            }), 400
            
        db = DatabaseManager()
        messages = db.get_private_chat_history(user1_id, user2_id)
        
        return jsonify({
            'status': 'success',
            'messages': messages or []
        })
        
    except Exception as e:
        print(f"Error getting chat history: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@private_chat.route('/private-chat/send', methods=['POST', 'OPTIONS'])
@require_auth
def send_private_message():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.get_json()
        # 從 JWT token 獲取 sender_id
        sender_id = request.current_user['user_id']
        receiver_id = data.get('receiver_id')
        content = data.get('content')
        
        if not all([sender_id, receiver_id, content]):
            return jsonify({
                'status': 'error',
                'message': '缺少必要參數'
            }), 400
            
        db = DatabaseManager()
        message_id = db.save_private_message(sender_id, receiver_id, content)
        
        if message_id:
            return jsonify({
                'status': 'success',
                'message_id': message_id
            })
            
        return jsonify({
            'status': 'error',
            'message': '發送訊息失敗'
        }), 500
        
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@private_chat.route('/available-chat-users/<user_id>', methods=['GET', 'OPTIONS'])
@require_auth
def get_available_users(user_id):
    # 驗證請求的 user_id 與 token 中的 user_id 一致
    if request.current_user['user_id'] != int(user_id):
        return jsonify({
            'status': 'error',
            'message': '無權限訪問'
        }), 403
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        db = DatabaseManager()
        users = db.get_available_chat_users(user_id)
        
        if users is not None:
            return jsonify({
                'status': 'success',
                'users': users
            })
        
        return jsonify({
            'status': 'error',
            'message': '獲取用戶列表失敗'
        }), 500
        
    except Exception as e:
        print(f"Error getting available users: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500