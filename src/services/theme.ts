import { BehaviorSubject } from 'rxjs';

class ThemeManager {
  private schemeQuerie = window.matchMedia('(prefers-color-scheme: dark)');

  currentTheme: 'light' | 'dark' = this.schemeQuerie.matches ? 'dark' : 'light';

  get prefersDark() { return this.currentTheme === 'dark' }
  get prefersLight() { return this.currentTheme === 'light' }

  currentThemeObs = new BehaviorSubject<'light' | 'dark'>(this.currentTheme);

  toggleTheme() {
    console.log('theme toggled!');
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.currentThemeObs.next(this.currentTheme);
  }
}

const themeManagerSinglton = new ThemeManager();

export default function getThemeManager() {
  return themeManagerSinglton;
}