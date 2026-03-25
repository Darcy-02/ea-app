from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from database import db, User, Follow
from helpers import login_required, get_current_user_optional
import os
import uuid

users_bp = Blueprint("users", __name__)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "uploads")


@users_bp.route("/<int:user_id>", methods=["GET"])
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = user.to_dict(include_counts=True)

    current_user = get_current_user_optional()
    if current_user and current_user.id != user_id:
        data["is_following"] = Follow.query.filter_by(
            follower_id=current_user.id, following_id=user_id
        ).first() is not None
    else:
        data["is_following"] = False

    return jsonify(data), 200


@users_bp.route("/<int:user_id>", methods=["PUT"])
@login_required
def update_profile(current_user, user_id):
    if current_user.id != user_id:
        return jsonify({"error": "Not authorized"}), 403

    bio = request.form.get("bio")
    username = request.form.get("username")
    avatar = request.files.get("avatar")

    if bio is not None:
        current_user.bio = bio.strip()
    if username is not None:
        username = username.strip()
        if username and username != current_user.username:
            if User.query.filter_by(username=username).first():
                return jsonify({"error": "Username already taken"}), 409
            current_user.username = username

    if avatar and avatar.filename:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        ext = os.path.splitext(secure_filename(avatar.filename))[1]
        filename = f"avatar_{uuid.uuid4().hex}{ext}"
        avatar.save(os.path.join(UPLOAD_DIR, filename))
        current_user.avatar_url = f"/static/uploads/{filename}"

    db.session.commit()
    return jsonify({"user": current_user.to_dict(include_counts=True)}), 200


@users_bp.route("/<int:user_id>/follow", methods=["POST"])
@login_required
def toggle_follow(current_user, user_id):
    if current_user.id == user_id:
        return jsonify({"error": "Cannot follow yourself"}), 400

    target = User.query.get(user_id)
    if not target:
        return jsonify({"error": "User not found"}), 404

    existing = Follow.query.filter_by(
        follower_id=current_user.id, following_id=user_id
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"following": False, "followers": target.follower_count()}), 200

    follow = Follow(follower_id=current_user.id, following_id=user_id)
    db.session.add(follow)
    db.session.commit()
    return jsonify({"following": True, "followers": target.follower_count()}), 200


@users_bp.route("/<int:user_id>/followers", methods=["GET"])
def get_followers(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    follows = Follow.query.filter_by(following_id=user_id).all()
    users = [User.query.get(f.follower_id) for f in follows]
    return jsonify({"users": [u.to_dict() for u in users if u]}), 200


@users_bp.route("/<int:user_id>/following", methods=["GET"])
def get_following(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    follows = Follow.query.filter_by(follower_id=user_id).all()
    users = [User.query.get(f.following_id) for f in follows]
    return jsonify({"users": [u.to_dict() for u in users if u]}), 200
