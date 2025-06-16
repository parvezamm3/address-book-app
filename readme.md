# アドレス帳アプリケーション

React フロントエンド、Flask バックエンド、SQLite データベースで構築された住所管理のためのフルスタック Web アプリケーションです。

## 機能

- 詳細情報（氏名、郵便番号、都道府県、市区町村、番地、アパート、電話、メール）付きの新しい住所の追加
- ホームページで全ての保存済み住所をテーブル形式で表示
- 既存住所の編集
- 既存住所の削除
- SQLite を使った永続的なデータ保存

## 使用技術

- **フロントエンド:** React.js、Vite（開発・バンドル用）、React Router
- **バックエンド:** Flask（Python）、Flask-CORS
- **データベース:** SQLite3
- **パッケージ管理:** npm（Node.js）、pip（Python）

## 前提条件

Windows マシンに以下がインストールされていることを確認してください。

- **Python 3.10+**: [python.org からダウンロード](https://www.python.org/downloads/)（インストール時に「Add Python to PATH」にチェック）
- **Node.js & npm**: [nodejs.org から LTS をダウンロード](https://nodejs.org/)（npm は同梱）
- **（推奨）Git**: [git-scm.com からダウンロード](https://git-scm.com/)

## セットアップとアプリケーションの実行

以下の手順でローカル環境にアプリケーションをセットアップします。

### 1. リポジトリのクローン
```sh
git clone https://github.com/parvezamm3/address-book-app.git
cd address-book-app
```
### 2. バックエンドのセットアップ（Flask & SQLite）

バックエンドディレクトリへ移動：

```sh
cd backend
```

#### a. Python 仮想環境の作成と有効化

```sh
python -m venv venv
.\venv\Scripts\activate  # Windows PowerShell/CMD の場合
```

#### b. Python 依存パッケージのインストール

```sh
pip install -r requirements.txt
```

`requirements.txt` に `Flask` と `Flask-CORS` が含まれていることを確認してください。

### .env ファイルを作成する
以下のフォーマットに従って .env ファイルを作成します
```file
SECRET_KEY='SECRET_KEY'
LDAP_SERVER='LDAP_IP_ADDRESSS'
LDAP_PORT="LDAP_PORT"
LDAP_USE_SSL=False
LDAP_DOMAIN="LDAP_DOMAIN"
LDAP_TIMEOUT=5
LDAP_POOL_SIZE=10
LDAP_MAX_RETRIES=3
LDAP_RETRY_DELAY=1
LDAP_POOL_LIFETIME=300
```


#### c. データベースの初期化

```sh
flask --app app init-db
```

これで `instance/addresses.db` が作成され、スキーマがセットアップされます。

**注意:** `backend/schema.sql` を変更した場合は、データベースを再初期化してください：

1. Flask サーバーを停止（`Ctrl+C`）
2. `backend/instance/addresses.db` を削除
3. 再度 `flask --app app init-db` を実行

または、SQLite GUI（例:「DB Browser for SQLite」）を使ってデータを失わずにテーブルを変更できます。

#### d. Flask バックエンドサーバーの起動

```sh
flask --app app run
```

バックエンドは [http://127.0.0.1:5000/](http://127.0.0.1:5000/) で動作します。

### 3. フロントエンドのセットアップ（React）

新しいターミナルを開き、フロントエンドディレクトリへ移動：

```sh
cd ..      # 必要に応じて address-book-app ルートに戻る
cd frontend
```

#### a. Node.js 依存パッケージのインストール

```sh
npm install
```

#### b. React 開発サーバーの起動

```sh
npm run dev
```