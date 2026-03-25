from flask import Blueprint, request, jsonify
from database import db, Upload, Reaction, User
from helpers import admin_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/uploads", methods=["GET"])
@admin_required
def get_all_uploads(current_user):
    uploads = Upload.query.order_by(Upload.created_at.desc()).all()
    return jsonify({"success": True, "posts": [u.to_dict() for u in uploads]}), 200


@admin_bp.route("/uploads/<int:upload_id>", methods=["DELETE"])
@admin_required
def delete_upload(current_user, upload_id):
    upload = Upload.query.get(upload_id)
    if not upload:
        return jsonify({"success": False, "message": "Upload not found"}), 404
    db.session.delete(upload)
    db.session.commit()
    return jsonify({"success": True}), 200


@admin_bp.route("/reactions", methods=["GET"])
@admin_required
def get_all_reactions(current_user):
    reactions = Reaction.query.order_by(Reaction.created_at.desc()).all()
    data = []
    for r in reactions:
        user = User.query.get(r.user_id)
        upload = Upload.query.get(r.upload_id)
        data.append({
            "id": r.id,
            "type": r.type,
            "reaction_details": r.reaction_details or "",
            "user_name": user.username if user else "Deleted user",
            "post_title": upload.title if upload else "Deleted post",
        })
    return jsonify({"success": True, "reactions": data}), 200


@admin_bp.route("/reactions/<int:reaction_id>", methods=["DELETE"])
@admin_required
def delete_reaction(current_user, reaction_id):
    reaction = Reaction.query.get(reaction_id)
    if not reaction:
        return jsonify({"success": False, "message": "Reaction not found"}), 404
    db.session.delete(reaction)
    db.session.commit()
    return jsonify({"success": True}), 200


@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_all_users(current_user):
    users = User.query.all()
    return jsonify({"success": True, "users": [u.to_dict() for u in users]}), 200


@admin_bp.route("/users/<int:user_id>/role", methods=["PUT"])
@admin_required
def update_user_role(current_user, user_id):
    if current_user.id == user_id:
        return jsonify({"error": "Cannot change own role"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    role = data.get("role", "").strip()
    if role not in ("user", "admin"):
        return jsonify({"error": "Invalid role"}), 400

    user.role = role
    db.session.commit()
    return jsonify({"success": True, "user": user.to_dict()}), 200
