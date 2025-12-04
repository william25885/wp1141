from flask import Blueprint, request, jsonify
from DB_utils import DatabaseManager
from jwt_utils import require_auth

update_profile = Blueprint("update_profile", __name__)

@update_profile.route('/update-profile', methods=['POST'])
@require_auth
def update_user_profile():
    try:
        data = request.get_json()
        # 從 JWT token 獲取 user_id
        user_id = request.current_user['user_id']
        updates = data.get('updates', [])

        print(f"Received update request for user {user_id}: {updates}")

        if not user_id or not updates:
            return jsonify({
                'status': 'error',
                'message': '缺少必要參數'
            }), 400

        db = DatabaseManager()
        success = True
        
        # 基本資料欄位（USER 表）
        basic_fields = ['User_name', 'User_nickname', 'Phone', 'Birthday', 'Nationality', 'City', 'Sex']
        
        for update in updates:
            field = update.get('field')
            value = update.get('value')
            print(f"Updating field {field} with value {value}")
            
            # 判斷是基本資料還是詳細資料
            if field in basic_fields:
                # 更新基本資料（USER 表）
                if not db.update_user_basic_info(field, value, user_id):
                    print(f"Failed to update basic field {field}")
                    success = False
                    break
            else:
                # 更新詳細資料（USER_DETAIL 表）
                if not db.update_user_detail(field, value, user_id):
                    print(f"Failed to update detail field {field}")
                    success = False
                    break

        if success:
            print("Update successful")
            return jsonify({
                'status': 'success',
                'message': '更新成功'
            })
        else:
            print("Update failed")
            return jsonify({
                'status': 'error',
                'message': '更新失敗'
            }), 500

    except Exception as e:
        print(f"Error during update: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500
