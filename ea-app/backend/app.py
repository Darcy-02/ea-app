import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database import db
from routes.auth import auth_bp
from routes.uploads import uploads_bp
from routes.reactions import reactions_bp
from routes.users import users_bp
from routes.admin import admin_bp

load_dotenv()

app = Flask(__name__)
app.url_map.strict_slashes = False

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-fallback-key")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI", "sqlite:///emptyart.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max upload

import re

CORS(app,
    origins=[re.compile(r"http://localhost:\d+"), re.compile(r"http://100\.118\.105\.124:\d+")],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

db.init_app(app)

app.register_blueprint(auth_bp,      url_prefix="/api/auth")
app.register_blueprint(uploads_bp,   url_prefix="/api/uploads")
app.register_blueprint(reactions_bp, url_prefix="/api")
app.register_blueprint(users_bp,     url_prefix="/api/users")
app.register_blueprint(admin_bp,     url_prefix="/api/admin")


@app.route("/static/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory("static/uploads", filename)


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "message": "EmptyArt API is running"})


@app.route("/")
def api_tester():
    return send_from_directory("static", "api_tester.html")


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
