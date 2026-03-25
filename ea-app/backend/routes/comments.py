from flask import Blueprint, request, jsonify
from database import db, Comment, Artwork
from helpers import login_required, admin_required

comments_bp = Blueprint("comments", __name__)

@comments_bp.route("/<int:artwork_id>", methods=["GET"])
def get_comments(artwork_id):
    artwork = Artwork.query.get(artwork_id)
    if not artwork:
        return jsonify({"error": "Artwork not found"}), 404
    comments = Comment.query.filter_by(artwork_id=artwork_id)\
                            .order_by(Comment.created_at.desc()).all()
    return jsonify([c.to_dict() for c in comments]), 200

@comments_bp.route("/<int:artwork_id>", methods=["POST"])
@login_required
def add_comment(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    if not artwork:
        return jsonify({"error": "Artwork not found"}), 404
    data = request.get_json()
    if not data or not data.get("content", "").strip():
        return jsonify({"error": "Comment cannot be empty"}), 400
    new_comment = Comment(
        content    = data["content"].strip(),
        stage      = data.get("stage", "after"),
        user_id    = current_user.id,
        artwork_id = artwork_id
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"message": "Comment added!", "comment": new_comment.to_dict()}), 201

@comments_bp.route("/<int:comment_id>", methods=["DELETE"])
@login_required
def delete_comment(current_user, comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comment not found"}), 404
    if not current_user.role == "admin" and comment.user_id != current_user.id:
        return jsonify({"error": "You can only delete your own comments"}), 403
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted"}), 200