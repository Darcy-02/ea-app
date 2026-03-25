from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from database import db, Upload, Follow
from helpers import login_required, get_current_user_optional
import os
import uuid

uploads_bp = Blueprint("uploads", __name__)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "uploads")


@uploads_bp.route("/", methods=["GET"])
def get_all_uploads():
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    limit = min(limit, 50)

    current_user = get_current_user_optional()
    uid = current_user.id if current_user else None

    uploads = Upload.query.order_by(Upload.created_at.desc()) \
        .paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "success": True,
        "posts": [u.to_dict(current_user_id=uid) for u in uploads.items],
        "page": uploads.page,
        "pages": uploads.pages,
        "total": uploads.total,
    }), 200


@uploads_bp.route("/<int:upload_id>", methods=["GET"])
def get_upload(upload_id):
    upload = Upload.query.get(upload_id)
    if not upload:
        return jsonify({"error": "Upload not found"}), 404

    current_user = get_current_user_optional()
    uid = current_user.id if current_user else None

    return jsonify(upload.to_dict(current_user_id=uid)), 200


@uploads_bp.route("/", methods=["POST"])
@login_required
def create_upload(current_user):
    image = request.files.get("image")
    if not image or not image.filename:
        return jsonify({"error": "Image is required"}), 400

    title = request.form.get("title", "").strip()
    description = request.form.get("description", "").strip()

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    ext = os.path.splitext(secure_filename(image.filename))[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    image_path = os.path.join(UPLOAD_DIR, filename)
    image.save(image_path)

    image_url = f"/static/uploads/{filename}"

    new_upload = Upload(
        user_id=current_user.id,
        image_url=image_url,
        title=title,
        description=description,
    )
    db.session.add(new_upload)
    db.session.commit()

    return jsonify({
        "success": True,
        "post": new_upload.to_dict(current_user_id=current_user.id)
    }), 201


@uploads_bp.route("/<int:upload_id>", methods=["DELETE"])
@login_required
def delete_upload(current_user, upload_id):
    upload = Upload.query.get(upload_id)
    if not upload:
        return jsonify({"error": "Upload not found"}), 404
    if upload.user_id != current_user.id and current_user.role != "admin":
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(upload)
    db.session.commit()
    return jsonify({"success": True}), 200


@uploads_bp.route("/feed", methods=["GET"])
@login_required
def get_feed(current_user):
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    limit = min(limit, 50)

    following_ids = [f.following_id for f in
                     Follow.query.filter_by(follower_id=current_user.id).all()]

    if following_ids:
        uploads = Upload.query.filter(Upload.user_id.in_(following_ids)) \
            .order_by(Upload.created_at.desc()) \
            .paginate(page=page, per_page=limit, error_out=False)
    else:
        uploads = Upload.query.order_by(Upload.created_at.desc()) \
            .paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "success": True,
        "posts": [u.to_dict(current_user_id=current_user.id) for u in uploads.items],
        "page": uploads.page,
        "pages": uploads.pages,
        "total": uploads.total,
    }), 200


@uploads_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_uploads(user_id):
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    limit = min(limit, 50)

    current_user = get_current_user_optional()
    uid = current_user.id if current_user else None

    uploads = Upload.query.filter_by(user_id=user_id) \
        .order_by(Upload.created_at.desc()) \
        .paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "success": True,
        "posts": [u.to_dict(current_user_id=uid) for u in uploads.items],
        "page": uploads.page,
        "pages": uploads.pages,
        "total": uploads.total,
    }), 200
