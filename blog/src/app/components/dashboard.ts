import { afterNextRender, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BlogFooterComponent } from './blog-footer';
import { BlogNavbarComponent } from './blog-navbar';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [RouterOutlet, BlogFooterComponent, BlogNavbarComponent],
  host: {
    class: 'flex min-h-[100dvh] flex-col',
  },
  template: `
    <main class="z-10 flex w-full flex-auto flex-col pt-6">
      <app-blog-navbar />
      <div class="relative flex flex-auto">
        <router-outlet />
        <!-- Terminal Rain Background -->
        <div
          class="terminal-rain fixed left-0 top-0 h-full w-full"
          id="terminal-container"></div>
      </div>
      <app-blog-footer />
    </main>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private terminalInterval?: number;
  private terminalLines: string[] = [];

  constructor() {
    afterNextRender(() => {
      this.initializeTerminal();
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.terminalInterval) {
      clearInterval(this.terminalInterval);
    }
  }

  private initializeTerminal(): void {
    const container = document.getElementById('terminal-container');
    if (!container) {
      console.log('Terminal container not found');
      return;
    }

    console.log('Initializing terminal animation...');

    // Mr. Robot style terminal commands and outputs
    const terminalCommands = [
      'ssh root@192.168.1.1',
      'whoami',
      'ps aux | grep -i evil',
      'netstat -tulpn',
      'cat /etc/passwd',
      'sudo rm -rf /*',
      'ping -c 4 evil-corp.com',
      'nmap -sS 192.168.1.0/24',
      'tail -f /var/log/auth.log',
      'hydra -l admin -P rockyou.txt ssh://target',
      'john --wordlist=dict.txt shadow',
      'aircrack-ng -w wordlist capture.cap',
      'msfconsole',
      'exploit/multi/handler',
      'use exploit/windows/smb/ms17_010_eternalblue',
      'set RHOST 192.168.1.100',
      'exploit',
      '[+] Meterpreter session opened',
      'sysinfo',
      'hashdump',
      'ERROR: Access denied',
      'Connection lost...',
      'Retrying connection...',
      '[WARNING] Firewall detected',
      'Bypassing security...',
      '[SUCCESS] Shell access gained',
      'Downloading files...',
      '[ERROR] Connection terminated',
      'fsociety.dat loaded',
      'Initiating payload...',
      'rm -rf evil_corp_backup/*',
      'cd /home/elliot',
      'nano mr_robot.py',
      'python3 exploit.py',
      'gcc -o backdoor backdoor.c',
      './backdoor --silent',
      'killall -9 antivirus',
      'chmod +x root_shell',
      'su - root',
      'Password: ********',
      'root@fsociety:~#',
      'echo "Hello friend"',
      'history -c',
    ];

    // Clear existing content
    container.innerHTML = '';

    // Create terminal lines - covering more of the screen
    const lineCount = 18; // Increased from previous implementation
    console.log(`Creating ${lineCount} terminal lines`);

    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      line.className = 'terminal-line';

      // Randomly assign command types
      const rand = Math.random();
      if (rand < 0.3) {
        line.classList.add('prompt');
      } else if (rand < 0.5) {
        line.classList.add('error');
      } else {
        line.classList.add('success');
      }

      // Select random command
      const command =
        terminalCommands[Math.floor(Math.random() * terminalCommands.length)];
      line.textContent = command;

      // Add animation duration - longer for better visibility
      line.style.animationDuration = `${8 + Math.random() * 4}s`; // 8-12 seconds

      container.appendChild(line);
    }

    console.log('Terminal initialization complete');

    // Periodically update the terminal commands
    this.terminalInterval = window.setInterval(() => {
      this.updateTerminalLines();
    }, 2000); // Slower update for better readability
  }

  private updateTerminalLines(): void {
    const container = document.getElementById('terminal-container');
    if (!container) return;

    const terminalCommands = [
      'ssh root@192.168.1.1',
      'whoami',
      'ps aux | grep -i evil',
      'netstat -tulpn',
      'cat /etc/passwd',
      'sudo rm -rf /*',
      'ping -c 4 evil-corp.com',
      'nmap -sS 192.168.1.0/24',
      'tail -f /var/log/auth.log',
      'hydra -l admin -P rockyou.txt ssh://target',
      'john --wordlist=dict.txt shadow',
      'aircrack-ng -w wordlist capture.cap',
      'msfconsole',
      'exploit/multi/handler',
      'use exploit/windows/smb/ms17_010_eternalblue',
      'set RHOST 192.168.1.100',
      'exploit',
      '[+] Meterpreter session opened',
      'sysinfo',
      'hashdump',
      'ERROR: Access denied',
      'Connection lost...',
      'Retrying connection...',
      '[WARNING] Firewall detected',
      'Bypassing security...',
      '[SUCCESS] Shell access gained',
      'Downloading files...',
      '[ERROR] Connection terminated',
      'fsociety.dat loaded',
      'Initiating payload...',
      'rm -rf evil_corp_backup/*',
      'cd /home/elliot',
      'nano mr_robot.py',
      'python3 exploit.py',
      'gcc -o backdoor backdoor.c',
      './backdoor --silent',
      'killall -9 antivirus',
      'chmod +x root_shell',
      'su - root',
      'Password: ********',
      'root@fsociety:~#',
      'echo "Hello friend"',
      'history -c',
    ];

    const lines = container.querySelectorAll('.terminal-line');

    lines.forEach((line, index) => {
      // Randomly update some lines for variety
      if (Math.random() < 0.6) {
        const command =
          terminalCommands[Math.floor(Math.random() * terminalCommands.length)];
        line.textContent = command;

        // Randomly change line type
        line.className = 'terminal-line';
        const rand = Math.random();
        if (rand < 0.3) {
          line.classList.add('prompt');
        } else if (rand < 0.5) {
          line.classList.add('error');
        } else {
          line.classList.add('success');
        }
      }
    });
  }
}
