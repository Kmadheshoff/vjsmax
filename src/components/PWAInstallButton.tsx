import { useState } from 'react';
import { Check, Copy, Download, ExternalLink, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { VJ_SIDDHU_LOGO_URL } from '../data/catalog';
import { SafeImage } from './SafeImage';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'subtle';
}

export function PWAInstallButton({ variant = 'primary' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (isInstalled) {
    return null;
  }

  const appOrigin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-gvkrhphe66mvygmezzelho-519641733476.asia-southeast1.run.app';

  const handleAction = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuide(true);
      }
      return;
    }
    setShowGuide(true);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(appOrigin);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(false);
    }
  };

  const buttonStyles =
    variant === 'primary'
      ? 'bg-yellow-400 text-[#1A1404] hover:bg-yellow-300 shadow-sm shadow-yellow-500/20'
      : 'bg-white ring-1 ring-amber-200 text-[#1A1404] hover:bg-yellow-400 dark:bg-[#1A150C] dark:ring-yellow-400/25 dark:text-[#FEF9E7] dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] shadow-sm';

  return (
    <>
      <button
        type="button"
        onClick={handleAction}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${buttonStyles}`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>{isInstallable ? 'Install App' : 'Get App / APK'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-[#FFFDF7] text-[#1A1404] ring-1 ring-amber-200 shadow-2xl dark:bg-[#16120B] dark:text-[#FEF9E7] dark:ring-yellow-400/20 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-yellow-400 bg-white p-1 shrink-0 shadow-sm">
                  <SafeImage
                    src={VJ_SIDDHU_LOGO_URL}
                    fallbackSrc="/pwa-192x192.png"
                    alt="VJS Max App Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h3
                    id="pwa-install-modal-title"
                    className="font-display text-lg font-extrabold tracking-tight"
                  >
                    Install VJS Max App
                  </h3>
                  <p className="text-xs text-[#5C4D24] dark:text-[#B8A77A]">
                    Standalone Android / iOS App &amp; APK Export
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close install guide"
                onClick={() => setShowGuide(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100/70 text-[#1A1404] hover:bg-yellow-400 dark:bg-[#261F12] dark:text-[#FEF9E7] dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="mt-5 space-y-3 text-sm text-[#4A3C18] dark:text-[#D6C79C]">
                <p className="font-semibold text-[#1A1404] dark:text-[#FEF9E7]">
                  Install on iPhone / iPad (Safari):
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm">
                  <li>
                    Tap the <strong>Share</strong> icon in Safari&apos;s toolbar.
                  </li>
                  <li>
                    Scroll down and tap <strong>Add to Home Screen</strong>.
                  </li>
                  <li>
                    Tap <strong>Add</strong> to launch VJS Max fullscreen.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="mt-5 space-y-4 text-xs sm:text-sm text-[#4A3C18] dark:text-[#D6C79C]">
                <div className="rounded-xl bg-white ring-1 ring-amber-200/80 dark:bg-[#1E190E] dark:ring-yellow-400/15 p-3.5">
                  <p className="font-bold text-[#1A1404] dark:text-[#FEF9E7]">
                    1. Instant Android App Install (Chrome)
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Open this app directly in Chrome on Android, open the browser menu (⋮), and tap{' '}
                    <strong>Install app</strong> to add VJS Max as a standalone fullscreen app.
                  </p>
                </div>

                <div className="rounded-xl bg-white ring-1 ring-amber-200/80 dark:bg-[#1E190E] dark:ring-yellow-400/15 p-3.5">
                  <p className="font-bold text-[#1A1404] dark:text-[#FEF9E7]">
                    2. Package as Downloadable Android .APK
                  </p>
                  <p className="mt-1 leading-relaxed">
                    Copy your app URL below and paste it into{' '}
                    <a
                      href="https://www.pwabuilder.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-amber-700 hover:underline dark:text-yellow-400"
                    >
                      <span>PWABuilder</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    to download a signed Android <code>.apk</code> package using VJS Max&apos;s Web App Manifest.
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <code className="flex-1 truncate rounded-lg bg-[#FEF6DC] dark:bg-[#120F09] px-2.5 py-2 font-mono text-[11px] text-[#1A1404] dark:text-[#FEF9E7]">
                      {appOrigin}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-400 px-3 py-2 text-xs font-bold text-[#1A1404] hover:bg-yellow-300 transition-colors shrink-0"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#FEF6DC] py-2.5 text-xs sm:text-sm font-bold text-[#1A1404] hover:bg-yellow-400 dark:bg-[#261F12] dark:text-[#FEF9E7] dark:hover:bg-yellow-400 dark:hover:text-[#1A1404] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
