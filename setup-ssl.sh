#!/bin/bash

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "mkcert is not installed. Installing mkcert..."
    
    # Detect OS and install mkcert
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install mkcert
        else
            echo "Please install Homebrew first: https://brew.sh/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt &> /dev/null; then
            # Ubuntu/Debian
            sudo apt update
            sudo apt install -y libnss3-tools
            curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
            chmod +x mkcert-v*-linux-amd64
            sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
        elif command -v yum &> /dev/null; then
            # CentOS/RHEL
            sudo yum install -y nss-tools
            curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
            chmod +x mkcert-v*-linux-amd64
            sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
        else
            echo "Please install mkcert manually: https://github.com/FiloSottile/mkcert#installation"
            exit 1
        fi
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        # Windows
        if command -v choco &> /dev/null; then
            choco install mkcert
        elif command -v scoop &> /dev/null; then
            scoop install mkcert
        else
            echo "Please install mkcert manually: https://github.com/FiloSottile/mkcert#windows"
            exit 1
        fi
    else
        echo "Unsupported OS. Please install mkcert manually: https://github.com/FiloSottile/mkcert#installation"
        exit 1
    fi
fi

# Create SSL directory
mkdir -p ssl

# Install the local CA in the system trust store
echo "Installing local CA..."
mkcert -install

# Generate certificate for the domain
echo "Generating certificate for music-manager.app..."
mkcert -key-file ssl/music-manager.key -cert-file ssl/music-manager.crt music-manager.app localhost 127.0.0.1 ::1

# Set proper permissions
chmod 644 ssl/music-manager.crt
chmod 600 ssl/music-manager.key

echo ""
echo "✅ SSL certificates generated successfully!"
echo "Certificate: ssl/music-manager.crt"
echo "Private key: ssl/music-manager.key"
echo ""
echo "🎉 The certificates are automatically trusted by your system!"
echo "No browser warnings should appear when visiting https://music-manager.app"
echo ""
echo "Note: The local CA is installed in your system's trust store."
echo "You can remove it later with: mkcert -uninstall"