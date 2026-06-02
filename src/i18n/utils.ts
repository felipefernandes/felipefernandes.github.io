import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    if (l === 'pt') {
      let cleanPath = path.replace(/^\/en/, '');
      if (cleanPath === '') cleanPath = '/';
      
      // Mapeamento dinamico
      if (cleanPath.startsWith('/about')) {
        cleanPath = cleanPath.replace('/about', '/sobre');
      } else if (cleanPath.startsWith('/projects')) {
        cleanPath = cleanPath.replace('/projects', '/projetos');
      } else if (cleanPath.startsWith('/contact')) {
        cleanPath = cleanPath.replace('/contact', '/contato');
      } else if (cleanPath.startsWith('/articles')) {
        cleanPath = cleanPath.replace('/articles', '/artigos');
      } else if (cleanPath.startsWith('/talks')) {
        cleanPath = cleanPath.replace('/talks', '/palestras');
      } else if (cleanPath.startsWith('/archive')) {
        cleanPath = cleanPath.replace('/archive', '/arquivo');
      }
      
      return cleanPath;
    }
    
    // Mapeamento para ingles
    let cleanPath = path;
    if (cleanPath.startsWith('/sobre')) {
      cleanPath = cleanPath.replace('/sobre', '/about');
    } else if (cleanPath.startsWith('/projetos')) {
      cleanPath = cleanPath.replace('/projetos', '/projects');
    } else if (cleanPath.startsWith('/contato')) {
      cleanPath = cleanPath.replace('/contato', '/contact');
    } else if (cleanPath.startsWith('/artigos')) {
      cleanPath = cleanPath.replace('/artigos', '/articles');
    } else if (cleanPath.startsWith('/palestras')) {
      cleanPath = cleanPath.replace('/palestras', '/talks');
    } else if (cleanPath.startsWith('/arquivo')) {
      cleanPath = cleanPath.replace('/arquivo', '/archive');
    }
    
    // Evita duplicar prefixo se ja estiver no caminho
    if (cleanPath.startsWith('/en')) {
      return cleanPath;
    }
    
    return `/en${cleanPath === '/' ? '' : cleanPath}`;
  };
}
