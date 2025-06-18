# Subnet Calculator

A comprehensive web-based subnet calculator for IPv4 and IPv6 networks with advanced features for network administrators and engineers.

## Features

- **🌐 Dual Protocol Support**: Complete IPv4 and IPv6 subnet calculations
- **🔢 Automatic Host Detection**: Enter IPs with or without CIDR notation (auto-assumes /32 for IPv4, /128 for IPv6)
- **📊 Subnet Shifting**: Create subnets or supernets by changing CIDR values
- **📋 Subnet Listing**: View all generated subnets (up to 256) when subnetting
- **✅ Subnet Containment Check**: Determine if one subnet fits within another
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🌓 Dark/Light Themes**: Toggle with localStorage persistence
- **📋 Copy Support**: Copy any result to clipboard
- **♿ Accessible**: Full ARIA support and keyboard navigation

## Quick Start

```bash
# Clone or download the project
cd subnetcalc

# Install dependencies
npm install

# Build the application
npm run build

# Serve locally
npm run serve
# OR
python3 -m http.server 8000 --directory public
```

Then open http://localhost:8000 in your browser.

## Usage Examples

### Basic Subnet Calculation
- **Input**: `192.168.1.0/24`
- **Result**: Network info, host ranges, subnet mask, binary/hex notation, etc.

### Host Address Analysis
- **Input**: `192.168.1.100` (no CIDR)
- **Result**: Treated as `/32` host with complete analysis

### Subnet Containment Check
- **Main Input**: `192.168.1.0/24`
- **Compare Subnet**: `192.168.1.0/25`
- **Result**: ✅ YES - 192.168.1.0/25 is within 192.168.1.0/24

### Subnetting (Creating Smaller Networks)
- **Main Input**: `192.168.1.0/24`
- **Shift CIDR**: `26`
- **Result**: 
  - Original `/24` network (254 hosts)
  - New `/26` subnets (62 hosts each)
  - Complete list of 4 subnets created

### Supernetting (Creating Larger Networks)
- **Main Input**: `192.168.1.0/24`
- **Shift CIDR**: `22`
- **Result**: 
  - Original `/24` network
  - New `/22` supernet (1022 hosts)

### IPv6 Support
- **Input**: `2001:db8::/64`
- **Result**: Complete IPv6 network analysis with proper formatting

## Calculated Information

### IPv4 Networks
- Network address and CIDR
- Broadcast address
- First and last host addresses
- Subnet mask and wildcard mask
- Network class (A, B, C, D, E)
- Total and usable host count
- Private network detection
- Binary and hexadecimal notation

### IPv6 Networks
- Network address and prefix
- Host bit calculations
- Total address count
- Private network detection (ULA, link-local, etc.)
- Compressed notation

### Advanced Features
- **Format Options**: Standard, Compact, and Detailed views
- **Subnet Lists**: When subnetting, see all created networks (up to 256)
- **Multiple Calculations**: Network info, host ranges, binary notation, etc.
- **Smart Truncation**: Large subnet lists (>256) are truncated with counts

## Technical Details

### Supported Formats
- **IPv4**: Any valid IPv4 address with optional CIDR (e.g., `192.168.1.0/24`, `10.0.0.1`)
- **IPv6**: Full or compressed IPv6 with optional CIDR (e.g., `2001:db8::/32`, `::1`)

### Browser Compatibility
- Modern browsers with ES6+ support
- No external dependencies required
- Works offline after initial load

### Architecture
- **TypeScript**: Type-safe development
- **Modular Design**: Separate utility classes and UI components
- **Responsive CSS**: Mobile-first design with brutalist aesthetic
- **Accessibility**: WCAG compliant with full keyboard navigation

## Build Commands

```bash
npm run build         # Compile TypeScript and create public/ folder
npm run dev          # Watch mode for development
npm run serve        # Serve with Node.js
npm run serve:python # Serve with Python HTTP server
```

## Use Cases

### Network Planning
- Design subnet schemes for organizations
- Calculate optimal CIDR sizes for different departments
- Verify IP allocation strategies

### Troubleshooting
- Check if devices are in correct subnets
- Analyze network addressing issues
- Validate routing configurations

### Education
- Learn IPv4 and IPv6 subnetting concepts
- Understand binary and hexadecimal representations
- Practice network design principles

### Documentation
- Generate subnet lists for network documentation
- Copy calculated values for configuration files
- Create network diagrams with accurate addressing

## Security & Privacy

- **Client-side only**: All calculations performed in browser
- **No data transmission**: No network requests or data collection
- **Offline capable**: Works without internet connection
- **No tracking**: No analytics or user monitoring

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

*A powerful, privacy-focused subnet calculator built for network professionals who need reliable, comprehensive subnet analysis tools.*