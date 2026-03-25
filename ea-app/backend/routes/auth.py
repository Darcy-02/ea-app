from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import db, User
from helpers import generate_token, login_required

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data.get("email") or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Email, username, and password are required"}), 400

    if len(data["password"]) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already taken"}), 409

    hashed_password = generate_password_hash(data["password"])

    new_user = User(
        email=data["email"],
        username=data["username"],
        password=hashed_password,
    )
    db.session.add(new_user)
    db.session.commit()

    token = generate_token(new_user.id, new_user.role)

    return jsonify({
        "message": "Account created successfully!",
        "token": token,
        "user": new_user.to_dict(),
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user.id, user.role)

    return jsonify({
        "message": "Login successful!",
        "token": token,
        "user": user.to_dict(),
    }), 200


@auth_bp.route("/me", methods=["GET"])
@login_required
def get_me(current_user):
    return jsonify({"user": current_user.to_dict(include_counts=True)}), 200
