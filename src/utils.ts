// Subnet Calculator utility functions for IPv4 and IPv6 calculations

// Interface for subnet calculation results
export interface ProcessResult {
  input: string;
  output: string;
  format: FormatType;
  timestamp: Date;
  error?: string;
  subnetInfo?: SubnetInfo;
}

// Interface for detailed subnet information
export interface SubnetInfo {
  network: string;
  broadcast?: string; // IPv4 only
  firstHost?: string;
  lastHost?: string;
  subnetMask?: string; // IPv4 only
  wildcardMask?: string; // IPv4 only
  totalHosts: number;
  usableHosts: number;
  cidr: number;
  ipVersion: 4 | 6;
  networkClass?: string; // IPv4 only
  isPrivate?: boolean;
  prefix?: string; // IPv6 prefix notation
}

export type FormatType = 'default' | 'compact' | 'detailed';

// Main utility class for subnet calculations
export class Utils {
  // Main subnet calculation function
  public static processInput(input: string, format: FormatType = 'default'): ProcessResult {
    try {
      if (!input.trim()) {
        return {
          input: '',
          output: '',
          format,
          timestamp: new Date(),
          error: 'IP address cannot be empty'
        };
      }

      // Parse and calculate subnet information
      const subnetInfo = this.calculateSubnet(input.trim());
      if (!subnetInfo) {
        return {
          input,
          output: '',
          format,
          timestamp: new Date(),
          error: 'Invalid IP address or CIDR notation'
        };
      }

      let output = '';
      switch (format) {
        case 'compact':
          output = this.formatCompact(subnetInfo);
          break;
        case 'detailed':
          output = this.formatDetailed(subnetInfo);
          break;
        case 'default':
        default:
          output = this.formatDefault(subnetInfo);
          break;
      }

      return {
        input,
        output,
        format,
        timestamp: new Date(),
        subnetInfo
      };
    } catch (error) {
      return {
        input,
        output: '',
        format,
        timestamp: new Date(),
        error: `Error calculating subnet: ${error}`
      };
    }
  }

  // Calculate subnet information from IP/CIDR input
  private static calculateSubnet(input: string): SubnetInfo | null {
    let ipStr: string;
    let cidr: number;
    
    // Check if input contains CIDR notation
    if (!input.includes('/')) {
      // No CIDR provided - assume host address
      ipStr = input;
      // Determine IP version and set appropriate host CIDR
      if (ipStr.includes(':')) {
        cidr = 128; // IPv6 host address
      } else {
        cidr = 32;  // IPv4 host address
      }
    } else {
      const parts = input.split('/');
      ipStr = parts[0];
      cidr = parseInt(parts[1], 10);
      
      if (isNaN(cidr)) {
        return null;
      }
    }

    // Determine IP version and calculate subnet
    if (ipStr.includes(':')) {
      return this.calculateIPv6Subnet(ipStr, cidr);
    } else {
      return this.calculateIPv4Subnet(ipStr, cidr);
    }
  }

  // Calculate IPv4 subnet information
  private static calculateIPv4Subnet(ip: string, cidr: number): SubnetInfo | null {
    if (cidr < 0 || cidr > 32) {
      return null;
    }

    // Validate IPv4 address format
    const ipParts = ip.split('.');
    if (ipParts.length !== 4) {
      return null;
    }

    const octets = ipParts.map(part => {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0 || num > 255) {
        return null;
      }
      return num;
    });

    if (octets.includes(null)) {
      return null;
    }

    // Convert IP to 32-bit integer
    const ipInt = (octets[0]! << 24) + (octets[1]! << 16) + (octets[2]! << 8) + octets[3]!;
    
    // Calculate network and broadcast addresses
    const hostBits = 32 - cidr;
    const subnetMask = (0xFFFFFFFF << hostBits) >>> 0;
    const networkInt = (ipInt & subnetMask) >>> 0;
    const broadcastInt = (networkInt | (0xFFFFFFFF >>> cidr)) >>> 0;
    
    // Convert back to dotted decimal
    const network = this.intToIPv4(networkInt);
    const broadcast = this.intToIPv4(broadcastInt);
    const subnetMaskStr = this.intToIPv4(subnetMask);
    const wildcardMask = this.intToIPv4((~subnetMask) >>> 0);
    
    // Calculate host addresses
    const firstHostInt = networkInt + 1;
    const lastHostInt = broadcastInt - 1;
    const firstHost = hostBits > 1 ? this.intToIPv4(firstHostInt) : network;
    const lastHost = hostBits > 1 ? this.intToIPv4(lastHostInt) : network;
    
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = Math.max(0, totalHosts - 2);
    
    // Determine network class
    const firstOctet = octets[0]!;
    let networkClass = '';
    if (firstOctet >= 1 && firstOctet <= 126) networkClass = 'A';
    else if (firstOctet >= 128 && firstOctet <= 191) networkClass = 'B';
    else if (firstOctet >= 192 && firstOctet <= 223) networkClass = 'C';
    else if (firstOctet >= 224 && firstOctet <= 239) networkClass = 'D (Multicast)';
    else if (firstOctet >= 240 && firstOctet <= 255) networkClass = 'E (Reserved)';
    
    // Check if private
    const isPrivate = this.isPrivateIPv4(networkInt);
    
    return {
      network,
      broadcast,
      firstHost,
      lastHost,
      subnetMask: subnetMaskStr,
      wildcardMask,
      totalHosts,
      usableHosts,
      cidr,
      ipVersion: 4,
      networkClass,
      isPrivate
    };
  }

  // Calculate IPv6 subnet information
  private static calculateIPv6Subnet(ip: string, cidr: number): SubnetInfo | null {
    if (cidr < 0 || cidr > 128) {
      return null;
    }

    try {
      // Expand IPv6 address to full form
      const expandedIP = this.expandIPv6(ip);
      if (!expandedIP) {
        return null;
      }

      // Calculate network address
      const network = this.calculateIPv6Network(expandedIP, cidr);
      const hostBits = 128 - cidr;
      const totalHosts = hostBits >= 64 ? Number.MAX_SAFE_INTEGER : Math.pow(2, hostBits);
      const usableHosts = Math.max(0, totalHosts - 2);
      
      // For IPv6, first and last host are typically not calculated the same way as IPv4
      const firstHost = network;
      const lastHost = network; // Simplified for display
      
      const isPrivate = this.isPrivateIPv6(expandedIP);
      
      return {
        network,
        firstHost,
        lastHost,
        totalHosts,
        usableHosts,
        cidr,
        ipVersion: 6,
        isPrivate,
        prefix: `${network}/${cidr}`
      };
    } catch (error) {
      return null;
    }
  }

  // Helper function to convert 32-bit integer to IPv4 string
  private static intToIPv4(int: number): string {
    return [
      (int >>> 24) & 0xFF,
      (int >>> 16) & 0xFF,
      (int >>> 8) & 0xFF,
      int & 0xFF
    ].join('.');
  }

  // Helper function to check if IPv4 is private
  private static isPrivateIPv4(ipInt: number): boolean {
    // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
    const ip = [(ipInt >>> 24) & 0xFF, (ipInt >>> 16) & 0xFF, (ipInt >>> 8) & 0xFF, ipInt & 0xFF];
    return (
      ip[0] === 10 ||
      (ip[0] === 172 && ip[1] >= 16 && ip[1] <= 31) ||
      (ip[0] === 192 && ip[1] === 168)
    );
  }

  // Helper function to expand IPv6 address to full form
  private static expandIPv6(ip: string): string | null {
    try {
      // Handle :: expansion
      if (ip.includes('::')) {
        const parts = ip.split('::');
        if (parts.length > 2) return null;
        
        const leftParts = parts[0] ? parts[0].split(':') : [];
        const rightParts = parts[1] ? parts[1].split(':') : [];
        const missingParts = 8 - leftParts.length - rightParts.length;
        
        const expandedParts = [
          ...leftParts,
          ...Array(missingParts).fill('0000'),
          ...rightParts
        ];
        
        return expandedParts.map(part => part.padStart(4, '0')).join(':');
      } else {
        const parts = ip.split(':');
        if (parts.length !== 8) return null;
        return parts.map(part => part.padStart(4, '0')).join(':');
      }
    } catch {
      return null;
    }
  }

  // Helper function to calculate IPv6 network address
  private static calculateIPv6Network(expandedIP: string, cidr: number): string {
    const parts = expandedIP.split(':');
    const networkParts = [];
    
    let remainingBits = cidr;
    for (let i = 0; i < 8; i++) {
      if (remainingBits >= 16) {
        networkParts.push(parts[i]);
        remainingBits -= 16;
      } else if (remainingBits > 0) {
        const hexVal = parseInt(parts[i], 16);
        const mask = (0xFFFF << (16 - remainingBits)) & 0xFFFF;
        const networkVal = (hexVal & mask) >>> 0;
        networkParts.push(networkVal.toString(16).padStart(4, '0'));
        remainingBits = 0;
      } else {
        networkParts.push('0000');
      }
    }
    
    return networkParts.join(':');
  }

  // Helper function to check if IPv6 is private
  private static isPrivateIPv6(expandedIP: string): boolean {
    // Simplified check for common private ranges
    return (
      expandedIP.startsWith('fd') || // Unique local unicast
      expandedIP.startsWith('fc') || // Unique local unicast
      expandedIP.startsWith('fe80') || // Link-local
      expandedIP === '0000:0000:0000:0000:0000:0000:0000:0001' // Loopback
    );
  }

  // Format subnet information in default style
  private static formatDefault(subnetInfo: SubnetInfo): string {
    if (subnetInfo.ipVersion === 4) {
      return `Network: ${subnetInfo.network}/${subnetInfo.cidr}
Broadcast: ${subnetInfo.broadcast}
Usable Hosts: ${subnetInfo.usableHosts.toLocaleString()}
Subnet Mask: ${subnetInfo.subnetMask}`;
    } else {
      return `Network: ${subnetInfo.network}/${subnetInfo.cidr}
Prefix: ${subnetInfo.prefix}
Host Addresses: ${subnetInfo.totalHosts === Number.MAX_SAFE_INTEGER ? '2^' + (128 - subnetInfo.cidr) : subnetInfo.totalHosts.toLocaleString()}`;
    }
  }

  // Format subnet information in compact style
  private static formatCompact(subnetInfo: SubnetInfo): string {
    if (subnetInfo.ipVersion === 4) {
      return `${subnetInfo.network}/${subnetInfo.cidr} | ${subnetInfo.usableHosts} hosts | ${subnetInfo.subnetMask}`;
    } else {
      return `${subnetInfo.network}/${subnetInfo.cidr} | IPv6 network`;
    }
  }

  // Format subnet information in detailed style
  private static formatDetailed(subnetInfo: SubnetInfo): string {
    const timestamp = new Date().toLocaleTimeString();
    
    if (subnetInfo.ipVersion === 4) {
      return `Network Address: ${subnetInfo.network}
Broadcast Address: ${subnetInfo.broadcast}
First Host: ${subnetInfo.firstHost}
Last Host: ${subnetInfo.lastHost}
Subnet Mask: ${subnetInfo.subnetMask}
Wildcard Mask: ${subnetInfo.wildcardMask}
CIDR: /${subnetInfo.cidr}
Network Class: ${subnetInfo.networkClass}
Total Addresses: ${subnetInfo.totalHosts.toLocaleString()}
Usable Hosts: ${subnetInfo.usableHosts.toLocaleString()}
Private Network: ${subnetInfo.isPrivate ? 'Yes' : 'No'}
Calculated at: ${timestamp}`;
    } else {
      return `Network Address: ${subnetInfo.network}
Prefix Notation: ${subnetInfo.prefix}
CIDR: /${subnetInfo.cidr}
Host Bits: ${128 - subnetInfo.cidr}
Total Addresses: ${subnetInfo.totalHosts === Number.MAX_SAFE_INTEGER ? '2^' + (128 - subnetInfo.cidr) : subnetInfo.totalHosts.toLocaleString()}
Private Network: ${subnetInfo.isPrivate ? 'Yes' : 'No'}
Calculated at: ${timestamp}`;
    }
  }

  // Get available calculation options for autocomplete dropdown
  public static getAvailableOptions(): string[] {
    return [
      'Network Info',
      'Host Range',
      'Subnet Summary',
      'Binary Notation',
      'Hexadecimal',
      'Network Classes',
      'VLSM Analysis',
      'Supernet Info',
      'IPv6 Compression',
      'Route Aggregation'
    ];
  }

  // Validate calculation option name
  public static isValidOption(option: string): boolean {
    const availableOptions = this.getAvailableOptions();
    return availableOptions.includes(option) || option.trim().length > 0;
  }

  // KEEP: Generate a unique ID for elements - useful for dynamic content
  public static generateId(prefix: string = 'item'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // KEEP: Safely get element by ID with type checking - useful utility
  public static getElementById<T extends HTMLElement>(id: string): T | null {
    const element = document.getElementById(id);
    return element as T | null;
  }

  // KEEP: Debounce function for performance optimization
  // Useful for preventing excessive API calls or processing
  public static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait) as any;
    };
  }

  // KEEP: Copy text to clipboard with fallback for older browsers
  // Works with the copy button functionality in main.ts
  public static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }

  // KEEP: Format date for display - useful utility function
  // CUSTOMIZE: Add your own date formatting if needed
  public static formatDate(date: Date, format: 'short' | 'long' | 'time' = 'short'): string {
    switch (format) {
      case 'long':
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      case 'time':
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      case 'short':
      default:
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
    }
  }

  // Check if an IP address is within a given subnet
  public static isIPInSubnet(ip: string, subnetInfo: SubnetInfo): {result: boolean, error?: string} {
    try {
      // Remove any CIDR notation if present in the IP
      const cleanIP = ip.includes('/') ? ip.split('/')[0] : ip;
      
      if (subnetInfo.ipVersion === 4) {
        return this.isIPv4InSubnet(cleanIP, subnetInfo);
      } else {
        return this.isIPv6InSubnet(cleanIP, subnetInfo);
      }
    } catch (error) {
      return {result: false, error: `Error checking IP: ${error}`};
    }
  }

  // Check if IPv4 address is in subnet
  private static isIPv4InSubnet(ip: string, subnetInfo: SubnetInfo): {result: boolean, error?: string} {
    try {
      // Validate IPv4 format
      const ipParts = ip.split('.');
      if (ipParts.length !== 4) {
        return {result: false, error: 'Invalid IPv4 address format'};
      }

      const octets = ipParts.map(part => {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 0 || num > 255) {
          return null;
        }
        return num;
      });

      if (octets.includes(null)) {
        return {result: false, error: 'Invalid IPv4 address'};
      }

      // Convert IP to 32-bit integer
      const ipInt = (octets[0]! << 24) + (octets[1]! << 16) + (octets[2]! << 8) + octets[3]!;
      
      // Convert network address to integer
      const networkParts = subnetInfo.network.split('.');
      const networkOctets = networkParts.map(part => parseInt(part, 10));
      const networkInt = (networkOctets[0] << 24) + (networkOctets[1] << 16) + (networkOctets[2] << 8) + networkOctets[3];
      
      // Calculate subnet mask
      const hostBits = 32 - subnetInfo.cidr;
      const subnetMask = (0xFFFFFFFF << hostBits) >>> 0;
      
      // Check if IP is in the same network
      const ipNetwork = (ipInt & subnetMask) >>> 0;
      const targetNetwork = (networkInt & subnetMask) >>> 0;
      
      return {result: ipNetwork === targetNetwork};
    } catch (error) {
      return {result: false, error: `IPv4 check error: ${error}`};
    }
  }

  // Check if IPv6 address is in subnet
  private static isIPv6InSubnet(ip: string, subnetInfo: SubnetInfo): {result: boolean, error?: string} {
    try {
      // Expand both IPs to full form
      const expandedIP = this.expandIPv6(ip);
      const expandedNetwork = this.expandIPv6(subnetInfo.network);
      
      if (!expandedIP || !expandedNetwork) {
        return {result: false, error: 'Invalid IPv6 address format'};
      }

      // Convert to arrays of 16-bit integers
      const ipParts = expandedIP.split(':').map(part => parseInt(part, 16));
      const networkParts = expandedNetwork.split(':').map(part => parseInt(part, 16));
      
      // Check prefix bits
      let remainingBits = subnetInfo.cidr;
      for (let i = 0; i < 8; i++) {
        if (remainingBits >= 16) {
          if (ipParts[i] !== networkParts[i]) {
            return {result: false};
          }
          remainingBits -= 16;
        } else if (remainingBits > 0) {
          const mask = (0xFFFF << (16 - remainingBits)) & 0xFFFF;
          if ((ipParts[i] & mask) !== (networkParts[i] & mask)) {
            return {result: false};
          }
          break;
        } else {
          break;
        }
      }
      
      return {result: true};
    } catch (error) {
      return {result: false, error: `IPv6 check error: ${error}`};
    }
  }

  // Generate list of subnets when subnetting (splitting into smaller networks)
  public static generateSubnetList(originalSubnet: SubnetInfo, newCidr: number): string[] {
    if (newCidr <= originalSubnet.cidr) {
      return []; // Not subnetting, it's supernetting or same size
    }

    const subnetList: string[] = [];
    const bitsAdded = newCidr - originalSubnet.cidr;
    const numSubnets = Math.pow(2, bitsAdded);

    // Limit to 256 subnets for display
    const maxDisplay = Math.min(numSubnets, 256);

    if (originalSubnet.ipVersion === 4) {
      // IPv4 subnet generation
      const networkParts = originalSubnet.network.split('.');
      const networkOctets = networkParts.map(part => parseInt(part, 10));
      const networkInt = (networkOctets[0] << 24) + (networkOctets[1] << 16) + (networkOctets[2] << 8) + networkOctets[3];
      
      const hostBits = 32 - newCidr;
      const subnetSize = Math.pow(2, hostBits);
      
      for (let i = 0; i < maxDisplay; i++) {
        const subnetNetworkInt = networkInt + (i * subnetSize);
        const subnetNetwork = this.intToIPv4(subnetNetworkInt);
        subnetList.push(`${subnetNetwork}/${newCidr}`);
      }
    } else {
      // IPv6 subnet generation (simplified)
      const expandedNetwork = this.expandIPv6(originalSubnet.network);
      if (expandedNetwork) {
        const parts = expandedNetwork.split(':');
        const baseParts = parts.map(part => parseInt(part, 16));
        
        // For IPv6, we'll increment the appropriate part based on CIDR boundary
        const incrementPart = Math.floor((newCidr - 1) / 16);
        const bitsInPart = newCidr % 16;
        
        for (let i = 0; i < maxDisplay; i++) {
          const newParts = [...baseParts];
          let carry = i;
          
          // Add the increment starting from the right part
          for (let j = incrementPart; j >= 0 && carry > 0; j--) {
            const increment = carry << (16 - bitsInPart);
            newParts[j] = (newParts[j] + increment) & 0xFFFF;
            carry = Math.floor(carry / Math.pow(2, bitsInPart));
          }
          
          const newNetwork = newParts.map(part => part.toString(16).padStart(4, '0')).join(':');
          subnetList.push(`${newNetwork}/${newCidr}`);
        }
      }
    }

    return subnetList;
  }
}