try {
    # Check if node_modules exists
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing dependencies..."
        npm install
    }

    # Start the React application using react-scripts with npx
    Write-Host "Starting the React application..."
    npx cross-env NODE_OPTIONS=--openssl-legacy-provider npx react-scripts start
} catch {
    Write-Host "Error: $_"
    exit 1
}