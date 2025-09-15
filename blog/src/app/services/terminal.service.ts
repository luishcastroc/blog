import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  private terminalActive = signal(true);
  isTerminalActive = this.terminalActive.asReadonly();

  toggleTerminal(value: boolean): void {
    this.terminalActive.set(value);
  }
}
