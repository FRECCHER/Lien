# Lien予約ページ：メール通知の初期設定

予約フォームの送信内容は EmailJS からメール通知します。宛先はサイトには書かれず、EmailJSの管理画面で後から変更できます。

## 初回だけ行うこと

1. [EmailJS](https://www.emailjs.com/)でアカウントを作成する。
2. **Email Services** で、予約通知を送るメールサービスを接続する。予約数が少ない間は Gmail でも利用できる。
3. **Email Templates** でテンプレートを作成する。以下を設定する。
   - **To Email**: `0bc39t5p7262x7p@gmail.com`
   - **Bcc**: `hitomi@lavande-beauty.com`
   - **Subject**: `【Lien予約】{{line_name}}様｜{{first_choice}}`
   - **Content**:

```text
新しい予約リクエストが届きました。

お名前（LINE名）：{{line_name}}
メールアドレス：{{email}}
電話番号：{{phone}}
メニュー：{{menu}}
脱毛部位：{{hair_removal_area}}
まつ毛の希望：{{lash_request}}

第1希望：{{first_choice}}
第2希望：{{second_choice}}
第3希望：{{third_choice}}

ご相談・連絡事項：{{note}}
送信日時：{{requested_at}}
```

4. EmailJSの **Public Key**、**Service ID**、**Template ID** をコピーする。
5. `booking-config.js` の3か所に貼り付ける。

## 宛先を後から追加・変更する方法

EmailJSの **Email Templates** を開き、テンプレートの **To Email** または **Bcc** を編集します。サイトのコードは変更不要です。

- 宛先を追加する場合は、Bccに追加します。宛先同士にメールアドレスが見えません。
- このページではメールアドレスを必須で受け取ります。EmailJSのテンプレートで自動返信を有効にすると、送信直後に受付メールをお客様へ届けられます。LINEでの返信を希望する方には、予約ページから友だち追加を案内します。

## 公開前の確認

設定後、テスト送信を1回行い、2つの通知先に予約内容が届くことを確認してください。
