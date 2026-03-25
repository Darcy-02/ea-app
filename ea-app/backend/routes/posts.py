from flask import Blueprint, request, jsonify
from database import db, Artwork, SavedArtwork
from helpers import login_required

posts_bp = Blueprint("posts", __name__)

@posts_bp.route("/", methods=["GET"])
def get_all_posts():
    artworks = Artwork.query.order_by(Artwork.created_at.desc()).all()
    return jsonify({"success": True, "posts": [a.to_dict() for a in artworks]}), 200

@posts_bp.route("/<int:artwork_id>", methods=["GET"])
def get_post(artwork_id):
    artwork = Artwork.query.get(artwork_id)
    if not artwork:
        return jsonify({"error": "Artwork not found"}), 404
    return jsonify(artwork.to_dict()), 200

@posts_bp.route("/<int:artwork_id>/save", methods=["POST"])
@login_required
def toggle_save(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    if not artwork:
        return jsonify({"error": "Artwork not found"}), 404
    existing = SavedArtwork.query.filter_by(user_id=current_user.id, artwork_id=artwork_id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"message": "Artwork unsaved", "saved": False}), 200
    new_save = SavedArtwork(user_id=current_user.id, artwork_id=artwork_id)
    db.session.add(new_save)
    db.session.commit()
    return jsonify({"message": "Artwork saved!", "saved": True}), 200

@posts_bp.route("/<int:artwork_id>/share", methods=["GET"])
@login_required
def share_post(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    if not artwork:
        return jsonify({"error": "Artwork not found"}), 404
    share_url = f"http://localhost:3000/artworks/{artwork_id}"
    return jsonify({"message": "Share this link!", "url": share_url, "title": artwork.title}), 200

@posts_bp.route("/saved", methods=["GET"])
@login_required
def get_saved_posts(current_user):
    saves = SavedArtwork.query.filter_by(user_id=current_user.id).all()
    artworks = [Artwork.query.get(s.artwork_id) for s in saves]
    artworks = [a for a in artworks if a]
    return jsonify({
    "success": True,
    "posts": [a.to_dict() for a in artworks]
}), 200
