// serviceWorkerRegistration.js

// Este arquivo registra o service worker para ativar o cache e funcionamento offline do PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] é o endereço IPv6 para localhost.
  window.location.hostname === '[::1]' ||
  // 127.0.0.0/8 são endereços IPv4 locais.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // URL do service worker padrão
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // O service worker não será registrado se estiver num domínio diferente
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Verifica se o service worker existe ou não, para localhost
        checkValidServiceWorker(swUrl, config);

        // Faz log para dev sobre service worker em localhost
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'Este site está sendo servido pelo service worker em modo LOCALHOST.'
          );
        });
      } else {
        // Registra normalmente em produção
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Novo conteúdo disponível, avise o usuário para atualizar
              console.log('Novo conteúdo disponível; por favor, atualize a página.');

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Conteúdo está em cache pela primeira vez
              console.log('Conteúdo em cache para uso offline.');

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Erro ao registrar service worker:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Faz o fetch para garantir que o service worker existe
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      // Se o service worker não existir, recarrega a página
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker encontrado, registra normalmente
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'Sem conexão de internet. O app funcionará em modo offline.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
