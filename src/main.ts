// Subnet Calculator application entry point
import { Utils, FormatType } from './utils.js';

// TEMPLATE: Main application class
// CUSTOMIZE: Rename class and properties to match your application
class App {
  // DOM element references
  private mainInput: HTMLInputElement;
  private subnetCheckInput: HTMLInputElement;
  private subnetShiftInput: HTMLInputElement;
  private processBtn: HTMLButtonElement;
  private themeToggleBtn: HTMLButtonElement;
  private resultsDiv: HTMLDivElement;
  
  
  // Application state
  private currentFormat: FormatType = 'default';
  private lastSubnetInfo: any = null; // Store last calculated subnet for IP checking

  constructor() {
    // Initialize DOM element references
    this.mainInput = Utils.getElementById<HTMLInputElement>('main-input')!;
    this.subnetCheckInput = Utils.getElementById<HTMLInputElement>('subnet-check-input')!;
    this.subnetShiftInput = Utils.getElementById<HTMLInputElement>('subnet-shift-input')!;
    this.processBtn = Utils.getElementById<HTMLButtonElement>('process-btn')!;
    this.themeToggleBtn = Utils.getElementById<HTMLButtonElement>('theme-toggle-btn')!;
    this.resultsDiv = Utils.getElementById<HTMLDivElement>('results')!;

    // Initialize functionality
    this.bindEvents();
    this.attachCopyHandlers();
    this.loadThemeFromStorage();
    this.bindThemeToggle();
    this.loadFormatFromStorage();
    this.bindFormatButtons();
  }


  // Bind event listeners
  private bindEvents(): void {
    // Main calculation button
    this.processBtn.addEventListener('click', this.handleProcess.bind(this));
    
    // Enter key on main input triggers calculation
    this.mainInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleProcess();
      }
    });
    
    // Enter key on subnet check input triggers calculation
    this.subnetCheckInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleProcess();
      }
    });
    
    // Enter key on subnet shift input triggers calculation
    this.subnetShiftInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleProcess();
      }
    });
  }


  // Handle calculation (subnet and/or IP check and/or subnet shift)
  private handleProcess(): void {
    const inputText = this.mainInput.value.trim();
    const checkIpText = this.subnetCheckInput.value.trim();
    const shiftCidrText = this.subnetShiftInput.value.trim();
    
    if (!inputText) {
      this.showError('Please enter an IP address (e.g., 192.168.1.0/24 or just 192.168.1.1)');
      return;
    }
    
    // Calculate the original subnet first
    let result = Utils.processInput(inputText, this.currentFormat);
    this.lastSubnetInfo = result.subnetInfo;
    
    if (result.error) {
      this.displayResult(result);
      return;
    }
    
    // Handle subnet shifting if a new CIDR is provided
    let shiftedResult = null;
    if (shiftCidrText && this.lastSubnetInfo) {
      const newCidr = parseInt(shiftCidrText, 10);
      if (isNaN(newCidr)) {
        this.showError('Please enter a valid CIDR number (0-32 for IPv4, 0-128 for IPv6)');
        return;
      }
      
      const maxCidr = this.lastSubnetInfo.ipVersion === 4 ? 32 : 128;
      if (newCidr < 0 || newCidr > maxCidr) {
        this.showError(`CIDR must be between 0 and ${maxCidr} for IPv${this.lastSubnetInfo.ipVersion}`);
        return;
      }
      
      // Create shifted subnet by recalculating with new CIDR
      const baseIp = this.lastSubnetInfo.network;
      const shiftedInput = `${baseIp}/${newCidr}`;
      shiftedResult = Utils.processInput(shiftedInput, this.currentFormat);
      
      if (shiftedResult.error) {
        this.showError(shiftedResult.error);
        return;
      }
    }
    
    // Determine what to display based on inputs
    let ipCheckResult = null;
    if (checkIpText && this.lastSubnetInfo) {
      const isInSubnet = Utils.isIPInSubnet(checkIpText, this.lastSubnetInfo);
      const mainNetwork = `${this.lastSubnetInfo.network}/${this.lastSubnetInfo.cidr}`;
      
      if (isInSubnet.error) {
        this.showError(isInSubnet.error);
        return;
      }
      
      ipCheckResult = isInSubnet.result ? 
        `✅ YES - ${checkIpText} is within original subnet ${mainNetwork}` :
        `❌ NO - ${checkIpText} is NOT within original subnet ${mainNetwork}`;
    }
    
    // Display results based on what inputs were provided
    if (shiftedResult && ipCheckResult) {
      // All three: original, shifted, and IP check
      this.displayFullResult(result, shiftedResult, ipCheckResult);
    } else if (shiftedResult) {
      // Original and shifted subnet
      this.displayShiftedResult(result, shiftedResult);
    } else if (ipCheckResult) {
      // Original subnet and IP check
      this.displayCombinedResult(result, ipCheckResult);
    } else {
      // Just original subnet
      this.displayResult(result);
    }
  }

  // Display combined subnet calculation and IP check results
  private displayCombinedResult(subnetResult: any, checkResult: string): void {
    if (subnetResult.error) {
      this.showError(subnetResult.error);
      return;
    }
    
    this.resetResultsContainer();
    this.resultsDiv.style.display = 'block';
    
    // Show main subnet result
    const outputDiv = Utils.getElementById<HTMLDivElement>('output')!;
    outputDiv.innerHTML = `
      <div class="result-item">
        <h3>Subnet Calculation</h3>
        <div class="result-value">
          <pre id="main-result">${subnetResult.output}</pre>
          <button class="copy-btn" data-target-id="main-result">Copy</button>
        </div>
      </div>
      <div class="result-item subnet-check-result">
        <h3>IP Check Result</h3>
        <div class="result-value">
          <pre id="subnet-check-result">${checkResult}</pre>
          <button class="copy-btn" data-target-id="subnet-check-result">Copy</button>
        </div>
      </div>
    `;
    
    // Show all additional calculation results
    this.renderAllCalculations(subnetResult);
  }

  // TEMPLATE: Display processing results
  // CUSTOMIZE: Update this method to display your results
  private displayResult(result: any): void {
    if (result.error) {
      this.showError(result.error);
      return;
    }
    
    this.resetResultsContainer();
    this.resultsDiv.style.display = 'block';
    
    // Show main result
    const outputDiv = Utils.getElementById<HTMLDivElement>('output')!;
    outputDiv.innerHTML = `
      <div class="result-item">
        <h3>Result</h3>
        <div class="result-value">
          <pre id="main-result">${result.output}</pre>
          <button class="copy-btn" data-target-id="main-result">Copy</button>
        </div>
      </div>
    `;
    
    // Show all additional calculation results
    this.renderAllCalculations(result);
  }
  
  // Display original subnet and shifted subnet results
  private displayShiftedResult(originalResult: any, shiftedResult: any): void {
    if (originalResult.error || shiftedResult.error) {
      this.showError(originalResult.error || shiftedResult.error);
      return;
    }
    
    this.resetResultsContainer();
    this.resultsDiv.style.display = 'block';
    
    const outputDiv = Utils.getElementById<HTMLDivElement>('output')!;
    const originalCidr = originalResult.subnetInfo.cidr;
    const shiftedCidr = shiftedResult.subnetInfo.cidr;
    const shiftType = shiftedCidr > originalCidr ? 'Subnetting' : 'Supernetting';
    
    outputDiv.innerHTML = `
      <div class="result-item">
        <h3>Original Network</h3>
        <div class="result-value">
          <pre id="original-result">${originalResult.output}</pre>
          <button class="copy-btn" data-target-id="original-result">Copy</button>
        </div>
      </div>
      <div class="result-item">
        <h3>${shiftType} Result (/${shiftedCidr})</h3>
        <div class="result-value">
          <pre id="shifted-result">${shiftedResult.output}</pre>
          <button class="copy-btn" data-target-id="shifted-result">Copy</button>
        </div>
      </div>
    `;
    
    // Show calculations for the shifted subnet
    this.renderAllCalculations(shiftedResult);
    
    // Show subnet list if we're subnetting (creating smaller networks)
    if (shiftedCidr > originalCidr) {
      this.renderSubnetList(originalResult.subnetInfo, shiftedCidr);
    }
  }
  
  // Display all three: original, shifted, and IP check
  private displayFullResult(originalResult: any, shiftedResult: any, ipCheckResult: string): void {
    if (originalResult.error || shiftedResult.error) {
      this.showError(originalResult.error || shiftedResult.error);
      return;
    }
    
    this.resetResultsContainer();
    this.resultsDiv.style.display = 'block';
    
    const outputDiv = Utils.getElementById<HTMLDivElement>('output')!;
    const originalCidr = originalResult.subnetInfo.cidr;
    const shiftedCidr = shiftedResult.subnetInfo.cidr;
    const shiftType = shiftedCidr > originalCidr ? 'Subnetting' : 'Supernetting';
    
    outputDiv.innerHTML = `
      <div class="result-item">
        <h3>Original Network</h3>
        <div class="result-value">
          <pre id="original-result">${originalResult.output}</pre>
          <button class="copy-btn" data-target-id="original-result">Copy</button>
        </div>
      </div>
      <div class="result-item">
        <h3>${shiftType} Result (/${shiftedCidr})</h3>
        <div class="result-value">
          <pre id="shifted-result">${shiftedResult.output}</pre>
          <button class="copy-btn" data-target-id="shifted-result">Copy</button>
        </div>
      </div>
      <div class="result-item subnet-check-result">
        <h3>IP Check Result</h3>
        <div class="result-value">
          <pre id="ip-check-result">${ipCheckResult}</pre>
          <button class="copy-btn" data-target-id="ip-check-result">Copy</button>
        </div>
      </div>
    `;
    
    // Show calculations for the shifted subnet
    this.renderAllCalculations(shiftedResult);
    
    // Show subnet list if we're subnetting (creating smaller networks)
    if (shiftedCidr > originalCidr) {
      this.renderSubnetList(originalResult.subnetInfo, shiftedCidr);
    }
  }

  /**
   * Render all useful subnet calculations automatically
   */
  private renderAllCalculations(result: any): void {
    const resultsList = Utils.getElementById<HTMLDivElement>('results-list')!;
    resultsList.innerHTML = '';
    
    // Define all the calculations we want to show
    const allCalculations = [
      'Network Info',
      'Host Range', 
      'Subnet Summary',
      'Network Classes',
      'Binary Notation',
      'Hexadecimal'
    ];
    
    allCalculations.forEach((calculation) => {
      const item = document.createElement('div');
      item.className = 'result-item';
      
      const h3 = document.createElement('h3');
      h3.textContent = calculation;
      
      const resultText = this.generateCalculationResult(result.input, calculation);
      const resultId = `result-${Utils.generateId()}`;
      
      const wrapper = document.createElement('div');
      wrapper.className = 'result-value';
      
      const p = document.createElement('pre');
      p.id = resultId;
      p.textContent = resultText;
      
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.setAttribute('data-target-id', resultId);
      btn.textContent = 'Copy';
      
      wrapper.appendChild(p);
      wrapper.appendChild(btn);
      item.appendChild(h3);
      item.appendChild(wrapper);
      resultsList.appendChild(item);
    });
  }

  /**
   * Render list of subnets when subnetting
   */
  private renderSubnetList(originalSubnet: any, newCidr: number): void {
    const subnetList = Utils.generateSubnetList(originalSubnet, newCidr);
    
    if (subnetList.length === 0) {
      return; // No subnets to display
    }
    
    const resultsList = Utils.getElementById<HTMLDivElement>('results-list')!;
    
    const bitsAdded = newCidr - originalSubnet.cidr;
    const totalSubnets = Math.pow(2, bitsAdded);
    const displayCount = Math.min(totalSubnets, 256);
    
    const item = document.createElement('div');
    item.className = 'result-item subnet-list';
    
    const h3 = document.createElement('h3');
    h3.textContent = `Subnet List (${displayCount}${totalSubnets > 256 ? ' of ' + totalSubnets.toLocaleString() : ''} subnets)`;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'result-value';
    
    // Create subnet list content
    let subnetContent = subnetList.join('\n');
    if (totalSubnets > 256) {
      subnetContent += `\n... and ${(totalSubnets - 256).toLocaleString()} more subnets`;
    }
    
    const resultId = `subnet-list-${Utils.generateId()}`;
    const pre = document.createElement('pre');
    pre.id = resultId;
    pre.textContent = subnetContent;
    pre.style.maxHeight = '300px';
    pre.style.overflowY = 'auto';
    
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.setAttribute('data-target-id', resultId);
    btn.textContent = 'Copy';
    
    wrapper.appendChild(pre);
    wrapper.appendChild(btn);
    item.appendChild(h3);
    item.appendChild(wrapper);
    resultsList.appendChild(item);
  }

  /**
   * Generate result text for a specific calculation
   */
  private generateCalculationResult(input: string, calculation: string): string {
    // Get the subnet info from the last calculation
    const result = Utils.processInput(input, 'default');
    if (result.error || !result.subnetInfo) {
      return `${calculation}: Error calculating subnet information`;
    }
    
    const subnet = result.subnetInfo;
    
    switch (calculation) {
      case 'Network Info':
        return subnet.ipVersion === 4 
          ? `Network: ${subnet.network}
Class: ${subnet.networkClass}
Private: ${subnet.isPrivate ? 'Yes' : 'No'}`
          : `Network: ${subnet.network}
IPv6 Prefix: ${subnet.prefix}
Private: ${subnet.isPrivate ? 'Yes' : 'No'}`;
      
      case 'Host Range':
        return subnet.ipVersion === 4
          ? `First Host: ${subnet.firstHost}
Last Host: ${subnet.lastHost}`
          : `Network: ${subnet.network}
(IPv6 addressing differs from IPv4)`;
      
      case 'Subnet Summary':
        return `CIDR: /${subnet.cidr}
Total: ${subnet.totalHosts === Number.MAX_SAFE_INTEGER ? '2^' + (128 - subnet.cidr) : subnet.totalHosts.toLocaleString()}
Usable: ${subnet.usableHosts.toLocaleString()}`;
      
      case 'Binary Notation':
        if (subnet.ipVersion === 4) {
          const parts = subnet.network.split('.').map(part => 
            parseInt(part, 10).toString(2).padStart(8, '0')
          );
          return `Binary: ${parts.join('.')}`;
        }
        return 'Binary notation: IPv6 binary representation is very long';
      
      case 'Hexadecimal':
        if (subnet.ipVersion === 4) {
          const parts = subnet.network.split('.').map(part => 
            parseInt(part, 10).toString(16).padStart(2, '0').toUpperCase()
          );
          return `Hex: ${parts.join('.')}`;
        }
        return `Hex: ${subnet.network} (already in hexadecimal)`;
      
      case 'Network Classes':
        return subnet.ipVersion === 4
          ? `Class: ${subnet.networkClass}
Subnet Mask: ${subnet.subnetMask}
Wildcard Mask: ${subnet.wildcardMask}`
          : 'Network classes apply to IPv4 only';
      
      case 'VLSM Analysis':
        return `VLSM: /${subnet.cidr} provides ${subnet.usableHosts.toLocaleString()} usable addresses`;
      
      case 'Supernet Info':
        const supernetCIDR = Math.max(0, subnet.cidr - 1);
        return `Supernet: /${supernetCIDR} (combines 2 networks of /${subnet.cidr})`;
      
      case 'IPv6 Compression':
        return subnet.ipVersion === 6
          ? `Compressed: ${subnet.network} can be written as ${this.compressIPv6(subnet.network)}`
          : 'IPv6 compression applies to IPv6 addresses only';
      
      case 'Route Aggregation':
        return `Route Summary: ${subnet.network}/${subnet.cidr} represents ${subnet.totalHosts === Number.MAX_SAFE_INTEGER ? '2^' + (128 - subnet.cidr) : subnet.totalHosts.toLocaleString()} addresses`;
      
      default:
        return `${calculation}: ${subnet.network}/${subnet.cidr}`;
    }
  }
  
  // Helper method to compress IPv6 addresses
  private compressIPv6(ipv6: string): string {
    // Simple compression - remove leading zeros and compress consecutive zero groups
    return ipv6.replace(/\b0+/g, '').replace(/:0+/g, ':').replace(/::+/g, '::');
  }

  private resetResultsContainer(): void {
    this.resultsDiv.innerHTML = `
      <div id="output" class="output"></div>
      <div id="results-list" class="results-list"></div>
    `;
  }

  private showError(message: string): void {
    this.resultsDiv.innerHTML = `
      <div class="error-message">
        <h3>Error:</h3>
        <p>${message}</p>
      </div>
      <div id="output" class="output"></div>
      <div id="results-list" class="results-list"></div>
    `;
    this.resultsDiv.style.display = 'block';
  }

  /**
   * Load output format from localStorage
   */
  private loadFormatFromStorage(): void {
    const stored = localStorage.getItem('format');
    if (stored === 'default' || stored === 'compact' || stored === 'detailed') {
      this.currentFormat = stored as FormatType;
    }
  }

  /**
   * Bind format buttons to switch output style
   */
  private bindFormatButtons(): void {
    const btns = Array.from(document.querySelectorAll('.fmt-btn')) as HTMLButtonElement[];
    this.updateFormatButtons();
    
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const fmt = btn.getAttribute('data-format') as FormatType;
        this.currentFormat = fmt;
        localStorage.setItem('format', fmt);
        this.updateFormatButtons();
      });
    });
  }

  private updateFormatButtons(): void {
    const btns = Array.from(document.querySelectorAll('.fmt-btn')) as HTMLButtonElement[];
    btns.forEach(b => {
      const f = b.getAttribute('data-format') as FormatType;
      if (f === this.currentFormat) {
        b.classList.add('selected');
        b.setAttribute('aria-checked', 'true');
      } else {
        b.classList.remove('selected');
        b.setAttribute('aria-checked', 'false');
      }
    });
  }

  // KEEP: Attach global listener for copy buttons
  // This provides copy-to-clipboard functionality for any element with 'copy-btn' class
  private attachCopyHandlers(): void {
    document.addEventListener('click', async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('copy-btn')) {
        const id = target.getAttribute('data-target-id');
        if (id) {
          const el = document.getElementById(id);
          if (el) {
            const success = await Utils.copyToClipboard(el.textContent || '');
            const orig = target.textContent;
            target.textContent = success ? 'Copied!' : 'Failed';
            setTimeout(() => { 
              target.textContent = orig || 'Copy'; 
            }, 2000);
          }
        }
      }
    });
  }

  /**
   * Update the theme toggle icon based on dark mode state
   */
  private updateThemeIcon(isDark: boolean): void {
    this.themeToggleBtn.textContent = isDark ? '\uD83C\uDF19' : '\u2600\uFE0F';
  }

  // KEEP: Load theme preference from localStorage
  // This maintains dark/light mode across browser sessions
  private loadThemeFromStorage(): void {
    const stored = localStorage.getItem('theme');
    const dark = stored === 'dark';
    document.body.classList.toggle('dark', dark);
    this.updateThemeIcon(dark);
  }

  // KEEP: Toggle dark/light theme functionality
  // This handles the theme toggle button behavior
  private bindThemeToggle(): void {
    this.themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      this.updateThemeIcon(isDark);
    });
  }
}

// KEEP: Initialize app when DOM is ready
// CUSTOMIZE: Replace 'App' with your class name if you rename it
document.addEventListener('DOMContentLoaded', () => {
  new App();
});