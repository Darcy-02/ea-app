from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()


def _utcnow():
    return datetime.now(timezone.utc)


# ---- TABLE 1: Users ----------------------------------------
class User(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    email      = db.Column(db.String(150), unique=True, nullable=False)
    username   = db.Column(db.String(80),  unique=True, nullable=False)
    password   = db.Column(db.String(200), nullable=False)
    bio        = db.Column(db.Text, default="")
    avatar_url = db.Column(db.String(300), default="")
    role       = db.Column(db.String(20),  default="user")
    created_at = db.Column(db.DateTime,    default=_utcnow)

    uploads   = db.relationship("Upload",   backref="author",  lazy=True)
    reactions = db.relationship("Reaction", backref="user",    lazy=True)

    def follower_count(self):
        return Follow.query.filter_by(following_id=self.id).count()

    def following_count(self):
        return Follow.query.filter_by(follower_id=self.id).count()

    def to_dict(self, include_counts=False):
        d = {
            "id":         self.id,
            "email":      self.email,
            "username":   self.username,
            "bio":        self.bio or "",
            "avatar_url": self.avatar_url or "",
            "role":       self.role,
            "created_at": self.created_at.isoformat(),
        }
        if include_counts:
            d["followers"]  = self.follower_count()
            d["following"]  = self.following_count()
            d["followers_count"]  = self.follower_count()
            d["following_count"]  = self.following_count()
            d["upload_count"] = Upload.query.filter_by(user_id=self.id).count()
        return d


# ---- TABLE 2: Uploads --------------------------------------
class Upload(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    image_url   = db.Column(db.String(300), nullable=False)
    title       = db.Column(db.String(200), default="")
    description = db.Column(db.Text, default="")
    created_at  = db.Column(db.DateTime, default=_utcnow)

    reactions = db.relationship("Reaction", backref="upload", lazy=True, cascade="all, delete-orphan")

    def like_count(self):
        return Reaction.query.filter_by(upload_id=self.id, type="like").count()

    def comment_count(self):
        return Reaction.query.filter_by(upload_id=self.id, type="comment").count()

    def to_dict(self, current_user_id=None):
        d = {
            "id":          self.id,
            "user_id":     self.user_id,
            "image_url":   self.image_url,
            "title":       self.title or "",
            "description": self.description or "",
            "created_at":  self.created_at.isoformat(),
            "like_count":  self.like_count(),
            "comment_count": self.comment_count(),
            "author": {
                "id":       self.author.id,
                "username": self.author.username,
                "avatar_url": self.author.avatar_url or "",
            },
        }
        if current_user_id:
            d["is_liked"] = Reaction.query.filter_by(
                upload_id=self.id, user_id=current_user_id, type="like"
            ).first() is not None
            d["is_bookmarked"] = Reaction.query.filter_by(
                upload_id=self.id, user_id=current_user_id, type="bookmark"
            ).first() is not None
        return d


# ---- TABLE 3: Reactions ------------------------------------
class Reaction(db.Model):
    id               = db.Column(db.Integer, primary_key=True)
    upload_id        = db.Column(db.Integer, db.ForeignKey("upload.id"), nullable=False)
    user_id          = db.Column(db.Integer, db.ForeignKey("user.id"),   nullable=False)
    type             = db.Column(db.String(20), nullable=False)   # "like", "comment", "bookmark"
    reaction_details = db.Column(db.Text, default="")             # comment text
    created_at       = db.Column(db.DateTime, default=_utcnow)

    __table_args__ = (
        db.UniqueConstraint("user_id", "upload_id", "type",
                            name="unique_like_bookmark"),
    )

    def to_dict(self):
        return {
            "id":               self.id,
            "upload_id":        self.upload_id,
            "user_id":          self.user_id,
            "type":             self.type,
            "reaction_details": self.reaction_details or "",
            "text":             self.reaction_details or "",
            "created_at":       self.created_at.isoformat(),
            "username":         self.user.username if self.user else "",
            "avatar_url":       self.user.avatar_url or "" if self.user else "",
        }


# ---- TABLE 4: Follow ---------------------------------------
class Follow(db.Model):
    id           = db.Column(db.Integer, primary_key=True)
    follower_id  = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    following_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    created_at   = db.Column(db.DateTime, default=_utcnow)

    follower  = db.relationship("User", foreign_keys=[follower_id],  backref="following_rel")
    following = db.relationship("User", foreign_keys=[following_id], backref="followers_rel")

    __table_args__ = (
        db.UniqueConstraint("follower_id", "following_id", name="unique_follow"),
    )
