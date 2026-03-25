from flask import Blueprint, request, jsonify
from database import db, Reaction, Upload
from helpers import login_required

reactions_bp = Blueprint("reactions", __name__)


@reactions_bp.route("/uploads/<int:upload_id>/like", methods=["POST"])
@login_required
def toggle_like(current_user, upload_id):
    upload = Upload.query.get(upload_id)
    if not upload:
        return jsonify({"error": "Upload not found"}), 404

    existing = Reaction.query.filter_by(
        upload_id=upload_id, user_id=current_user.id, type="like"
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"liked": False, "like_count": upload.like_count()}), 200

    reaction = Reaction(
        upload_id=upload_id,
        user_id=current_user.id,
        type="like",
    )
    db.session.add(reaction)
    db.session.commit()
    return jsonify({"liked": True, "like_count": upload.like_count()}), 200


@reactions_bp.route("/uploads/<int:upload_id>/bookmark", methods=["POST"])
@login_required
def toggle_bookmark(current_user, upload_id):
    upload = Upload.query.get(upload_id)
    if not upload:
        return jsonify({"error": "Upload not found"}), 404

    existing = Reaction.query.filter_by(
        upload_id=upload_id, user_id=current_user.id, type="bookmark"
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"bookmarked": False}), 200

    reaction = Reaction(
        upload_id=upload_id,
        user_id=current_user.id,
        type="bookmark",
    )
    db.session.add(reaction)
    db.session.commit()
    return jsonify({"bookmarked": True}), 200


@reactions_bp.route("/uploads/<int:upload_id>/comment", methods=["POST"])
@login_required
def add_comment(current_user, upload_id):
    upload = Upload.query.get(upload_id)
    if not upload:
        return jsonify({"error": "Upload not found"}), 404

    data = request.get_json()
    content = (data.get("content") or "").strip() if data else ""
    if not content:
        return jsonify({"error": "Comment cannot be empty"}), 400

    reaction = Reaction(
        upload_id=upload_id,
        user_id=current_user.id,
        type="comment",
        reaction_details=content,
    )
    db.session.add(reaction)
    db.session.commit()
    return jsonify({"message": "Comment added!", "comment": reaction.to_dict()}), 201


@reactions_bp.route("/uploads/<int:upload_id>/comments", methods=["GET"])
def get_comments(upload_id):
    upload = Upload.query.get(upload_id)
    if not upload:
        return jsonify({"error": "Upload not found"}), 404

    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 30, type=int)
    limit = min(limit, 100)

    comments = Reaction.query.filter_by(upload_id=upload_id, type="comment") \
        .order_by(Reaction.created_at.desc()) \
        .paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "comments": [c.to_dict() for c in comments.items],
        "page": comments.page,
        "pages": comments.pages,
        "total": comments.total,
    }), 200


@reactions_bp.route("/reactions/<int:reaction_id>", methods=["DELETE"])
@login_required
def delete_reaction(current_user, reaction_id):
    reaction = Reaction.query.get(reaction_id)
    if not reaction:
        return jsonify({"error": "Reaction not found"}), 404
    if reaction.user_id != current_user.id and current_user.role != "admin":
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(reaction)
    db.session.commit()
    return jsonify({"success": True}), 200


@reactions_bp.route("/uploads/bookmarked", methods=["GET"])
@login_required
def get_bookmarked(current_user):
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    limit = min(limit, 50)

    bookmark_ids = [r.upload_id for r in
                    Reaction.query.filter_by(user_id=current_user.id, type="bookmark").all()]

    if not bookmark_ids:
        return jsonify({"success": True, "posts": [], "page": 1, "pages": 0, "total": 0}), 200

    uploads = Upload.query.filter(Upload.id.in_(bookmark_ids)) \
        .order_by(Upload.created_at.desc()) \
        .paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "success": True,
        "posts": [u.to_dict(current_user_id=current_user.id) for u in uploads.items],
        "page": uploads.page,
        "pages": uploads.pages,
        "total": uploads.total,
    }), 200
