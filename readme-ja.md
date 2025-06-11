
# アドレス帳アプリケーション

React フロントエンド、Flask バックエンド、SQLite データベースで構築された住所管理用のフルスタック Web アプリケーションです。

## 機能

- 詳細情報（氏名、郵便番号、都道府県、市区町村、番地、アパート、電話、メール）付きで新しい住所を追加
- ホームページで全ての保存済み住所をテーブル形式で表示
- 既存の住所を削除
- SQLite を使った永続的なデータ保存

## 使用技術

- **フロントエンド:** React.js, React Router
- **バックエンド:** Flask (Python), Flask-CORS
- **データベース:** SQLite3
- **パッケージ管理:** npm (Node.js), pip (Python)

## 前提条件

Windows マシンに以下がインストールされていることを確認してください:

- **Python 3.8+**: [python.org からダウンロード](https://www.python.org/downloads/)（インストール時に「Add Python to PATH」にチェック）
- **Node.js & npm**: [nodejs.org から LTS をダウンロード](https://nodejs.org/)（npm は同梱）
- **（推奨）Git**: [git-scm.com からダウンロード](https://git-scm.com/)

## セットアップとアプリケーションの実行

以下の手順でローカル環境にアプリケーションをセットアップします。

### 1. リポジトリのクローン

Git を使用する場合:

```sh
git clone <your-repository-url>
cd address-book-app
```

ローカルファイルがある場合は、`address-book-app` のルートディレクトリに移動してください。

### 2. バックエンドのセットアップ（Flask & SQLite）

バックエンドディレクトリに移動:

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

#### c. データベースの初期化

```sh
flask --app app init-db
```

これで `instance/addresses.db` が作成され、スキーマがセットアップされます。

**注意:** `backend/schema.sql` を変更した場合は、データベースを再初期化してください:

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

新しいターミナルを開き、フロントエンドディレクトリに移動:

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
npm start
```

React アプリは [http://localhost:3000/](http://localhost:3000/) で開きます。

## アプリケーションの使い方

- **ホームページ（`/`）**: 保存済み住所がテーブルで表示されます。
- **新規住所作成**: ボタンをクリックして作成フォーム（`/create`）へ移動。
- **住所作成ページ（`/create`）**: フォームに入力して送信。ホームページにリダイレクトされ、新しい住所が表示されます。
- **削除ボタン**: 各住所行に「削除」ボタンがあり、データベースから削除できます。