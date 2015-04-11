# aws-lambda-aes

> A Lambda function for AES encryption/decryption

**Note**: This function exists largely to test the [Lambda Function Manager](https://github.com/willyg302/lfm). Using lfm you can deploy this function via the following:

```bash
$ lfm deploy gh:willyg302/aws-lambda-aes
```

## Usage

aws-lambda-aes accepts a custom event with the following properties:

- `enc`: A boolean, true if you want to encrypt and false otherwise
- `message`: The message to encrypt or decrypt
- `pass`: A password to use as the key
- `opts`: Optional object containing cipher options
	- `length`: Key length to use, one of `128`, `192`, or `256`
	- `mode`: Supported modes are `cbc`, `cfb`, `cfb1`, `cfb8`, `ctr`, `ecb`, `gcm`, and `ofb`
	- `encoding`: Whether to encode as `base64` or `hex`

By default, aws-lambda-aes uses `aes-256-ecb` to/from `base64`.

## Testing

Call tests with `npm test`.
