# Changelog

All notable changes to the Subnet Calculator project will be documented in this file.

## [1.0.0] - 2024-12-XX

### Added
- **Complete IPv4 and IPv6 subnet calculations**
  - Network address, broadcast address, host ranges
  - Subnet mask, wildcard mask, network classes
  - Binary and hexadecimal notation support
  - Private network detection

- **Automatic host address detection**
  - Accepts IP addresses with or without CIDR notation
  - Auto-assumes /32 for IPv4 and /128 for IPv6 when no CIDR provided

- **Subnet shifting functionality**
  - Create subnets (smaller networks) by increasing CIDR
  - Create supernets (larger networks) by decreasing CIDR
  - Visual comparison between original and shifted networks

- **Subnet listing feature**
  - Displays all generated subnets when subnetting
  - Smart truncation at 256 subnets for performance
  - Scrollable list with copy functionality

- **IP membership checking**
  - Verify if an IP address belongs to a calculated subnet
  - Clear YES/NO visual indicators
  - Works with both original and shifted subnets

- **Multiple output formats**
  - Standard: Balanced detail level
  - Compact: Minimal essential information
  - Detailed: Comprehensive network analysis

- **User interface features**
  - Dark/light theme toggle with persistence
  - Responsive design for mobile and desktop
  - Copy-to-clipboard for all results
  - Proper line breaks for readable output
  - Full keyboard navigation support

- **Accessibility features**
  - WCAG compliant design
  - ARIA labels and descriptions
  - Screen reader support
  - Keyboard-only navigation

- **Technical features**
  - Client-side only processing (no server required)
  - TypeScript for type safety
  - Modular architecture
  - Zero external dependencies
  - Offline capable after initial load

### Technical Details
- Built with TypeScript for type safety
- Uses bit manipulation for efficient calculations
- Supports IPv6 address expansion and compression
- Implements proper CIDR validation for both protocols
- Memory-efficient subnet generation with display limits

### Browser Support
- Modern browsers with ES6+ support
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- No polyfills required for target browsers

### Performance
- All calculations performed client-side
- No network requests after initial page load
- Optimized for large subnet calculations
- Efficient memory usage with result truncation