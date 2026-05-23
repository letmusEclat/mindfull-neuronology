<!DOCTYPE html>

<html lang="es"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Respiración Consciente</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
        }

        @keyframes breathe-aura {
            0%, 100% { transform: scale(1.1); opacity: 0.3; }
            50% { transform: scale(1.4); opacity: 0.7; box-shadow: 0 0 40px 20px rgba(255, 224, 137, 0.5); }
        }

        @keyframes neural-glow {
            0%, 100% { stroke: rgba(129, 118, 100, 0.2); filter: drop-shadow(0 0 0px transparent); }
            50% { stroke: #facd3b; filter: drop-shadow(0 0 8px #facd3b); }
        }

        @keyframes radial-light {
            0%, 100% { opacity: 0.1; transform: scale(0.5); }
            50% { opacity: 0.8; transform: scale(1.2); }
        }

        @keyframes text-sync {
            0%, 100% { content: "Exhala suavemente..."; opacity: 0.8; }
            50% { content: "Inhala profundo..."; opacity: 1; }
        }

        .animate-breathe-aura {
            animation: breathe-aura 8s ease-in-out infinite;
        }
        
        .neural-path {
            animation: neural-glow 8s ease-in-out infinite;
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
        }

        .neural-dot {
            animation: neural-glow 8s ease-in-out infinite;
        }

        .radial-pulse {
            animation: radial-light 8s ease-in-out infinite;
        }

        .breathe-text::after {
            content: "Inhala profundo...";
            animation: text-sync 8s ease-in-out infinite;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-container-highest": "#eee1ce",
                        "on-background": "#211b0f",
                        "surface-dim": "#e5d8c6",
                        "primary-fixed": "#ffe089",
                        "primary-container": "#facd3b",
                        "inverse-on-surface": "#fcefdc",
                        "surface-container-high": "#f3e6d4",
                        "tertiary-fixed-dim": "#a7d646",
                        "on-tertiary-fixed-variant": "#374e00",
                        "on-secondary-fixed": "#2f1400",
                        "on-primary-container": "#6e5700",
                        "surface": "#fff8f2",
                        "primary-fixed-dim": "#edc22f",
                        "inverse-surface": "#363023",
                        "on-primary-fixed-variant": "#574400",
                        "surface-container-low": "#fff2df",
                        "on-secondary": "#ffffff",
                        "on-primary-fixed": "#241a00",
                        "outline-variant": "#d2c5b0",
                        "on-tertiary": "#ffffff",
                        "secondary-container": "#feb072",
                        "tertiary-container": "#b2e251",
                        "secondary-fixed": "#ffdcc4",
                        "surface-container-lowest": "#ffffff",
                        "surface-container": "#f9ecd9",
                        "on-error": "#ffffff",
                        "inverse-primary": "#edc22f",
                        "primary": "#745b00",
                        "on-error-container": "#93000a",
                        "on-secondary-container": "#78400a",
                        "on-tertiary-container": "#466300",
                        "secondary-fixed-dim": "#ffb780",
                        "on-primary": "#ffffff",
                        "surface-bright": "#fff8f2",
                        "tertiary-fixed": "#c2f360",
                        "tertiary": "#4a6800",
                        "surface-tint": "#745b00",
                        "on-tertiary-fixed": "#141f00",
                        "error-container": "#ffdad6",
                        "error": "#ba1a1a",
                        "background": "#fff8f2",
                        "secondary": "#8b501a",
                        "on-surface-variant": "#4f4636",
                        "surface-variant": "#eee1ce",
                        "outline": "#817664",
                        "on-secondary-fixed-variant": "#6e3902",
                        "on-surface": "#211b0f"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "lg": "24px",
                        "gutter": "16px",
                        "xs": "4px",
                        "md": "16px",
                        "base": "8px",
                        "sm": "8px",
                        "xl": "32px",
                        "margin": "24px",
                        "margin-mobile": "20px",
                        "stack-md": "16px"
                    },
                    "fontFamily": {
                        "body-md": ["Inter"],
                        "label-md": ["Inter"],
                        "headline-lg": ["Inter"],
                        "body-lg": ["Inter"],
                        "headline-md": ["Inter"]
                    },
                    "fontSize": {
                        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.5px", "fontWeight": "500"}],
                        "headline-lg": ["32px", {"lineHeight": "40px", "fontWeight": "700"}],
                        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}]
                    }
                },
            },
        }
    </script>
</head>
<body class="bg-surface text-on-surface font-body-md h-screen flex flex-col antialiased">
<!-- Top App Bar -->
<header class="bg-surface docked full-width top-0 flex justify-between items-center w-full px-margin-mobile py-stack-md z-40">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
<img alt="Avatar de Neurona" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBueCH6zUNQlqkhSpm9ZPpRrKcsgQqweQYDmld3h32PYm3NtUfzVRV4CdcQYf31iSwKTeMC8NWU3g0XRS5Vo1d1R0F6pSQEw_BlWZ3PGBU_300oPmBmkIlOE506LbEEtX9JqOQAyll3gRF4gKxXDTtTkXmw01bYEfED73jzhUEYVX1-vSUIwGRNo7d0PdpQIKeXv49diH-MGg3pVjstrw4IDwjBq76p490td6HZe64pI6ONK5738MUD1KlmrCtV5UB3buyMEGCcJKE"/>
</div>
<h1 class="font-headline-md text-primary">Respiración Consciente</h1>
</div>
<button aria-label="Ajustes" class="w-10 h-10 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors text-primary">
<span class="material-symbols-outlined">settings</span>
</button>
</header>
<!-- Main Content -->
<main class="flex-grow flex flex-col items-center justify-center px-margin-mobile relative z-10 overflow-hidden pb-24">
<!-- Breathing Guide Container -->
<div class="relative flex flex-col items-center justify-center w-full max-w-sm">
<!-- Avatar Message Bubble -->
<div class="bg-surface-container-lowest shadow-lg rounded-2xl p-4 mb-8 relative z-20 text-center mx-4 border border-surface-variant max-w-[280px]">
<p class="font-body-md text-body-md text-on-surface breathe-text"></p>
<!-- Tail for bubble -->
<div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-surface-container-lowest border-r-[12px] border-r-transparent drop-shadow-sm"></div>
</div>
<!-- Central Visualization -->
<div class="relative flex items-center justify-center w-64 h-64 mb-12">
<!-- Background Aura Pulse -->
<div class="absolute inset-0 bg-primary-fixed rounded-full animate-breathe-aura z-0"></div>
<!-- Neural Connection SVG -->
<div class="relative z-10 w-full h-full flex items-center justify-center">
<!-- Radial Glow Layer -->
<div class="absolute w-40 h-40 bg-primary-container rounded-full blur-3xl radial-pulse opacity-40"></div>
<svg class="w-56 h-56 z-20" viewbox="0 0 100 100">
<defs>
<lineargradient id="neuralGrad" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#facd3b"></stop>
<stop offset="100%" stop-color="#745b00"></stop>
</lineargradient>
</defs>
<!-- Neural Network Paths (Stylized Outline) -->
<g class="neural-path" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1">
<path d="M50 20 C60 20 75 30 80 50 C85 70 70 85 50 80 C30 85 15 70 20 50 C25 30 40 20 50 20"></path>
<path d="M50 35 L50 65 M35 50 L65 50" stroke-opacity="0.5"></path>
<path d="M30 40 L50 50 L70 40 M30 60 L50 50 L70 60" stroke-opacity="0.5"></path>
<!-- Connection lines mimicking IMAGE_15 -->
<line stroke-opacity="0.4" x1="50" x2="65" y1="20" y2="35"></line>
<line stroke-opacity="0.4" x1="50" x2="35" y1="20" y2="35"></line>
<line stroke-opacity="0.4" x1="80" x2="65" y1="50" y2="35"></line>
<line stroke-opacity="0.4" x1="80" x2="65" y1="50" y2="65"></line>
<line stroke-opacity="0.4" x1="50" x2="65" y1="80" y2="65"></line>
<line stroke-opacity="0.4" x1="50" x2="35" y1="80" y2="65"></line>
<line stroke-opacity="0.4" x1="20" x2="35" y1="50" y2="65"></line>
<line stroke-opacity="0.4" x1="20" x2="35" y1="50" y2="35"></line>
</g>
<!-- Nodes -->
<g class="neural-dot" fill="currentColor">
<circle cx="50" cy="20" r="2"></circle>
<circle cx="80" cy="50" r="2"></circle>
<circle cx="50" cy="80" r="2"></circle>
<circle cx="20" cy="50" r="2"></circle>
<circle cx="50" cy="50" r="3"></circle>
<circle cx="35" cy="35" r="1.5"></circle>
<circle cx="65" cy="35" r="1.5"></circle>
<circle cx="35" cy="65" r="1.5"></circle>
<circle cx="65" cy="65" r="1.5"></circle>
</g>
</svg>
</div>
</div>
<!-- Progress Indicator -->
<div class="w-full px-6 flex flex-col items-center gap-2">
<div class="font-headline-md text-primary font-bold">2:45</div>
<div class="font-label-md text-on-surface-variant">Tiempo de sesión: 5:00</div>
<!-- Progress Bar Base -->
<div class="w-full h-3 bg-surface-variant rounded-full mt-2 overflow-hidden shadow-inner">
<!-- Progress Fill -->
<div class="h-full bg-primary rounded-full w-[55%] relative">
<div class="absolute right-0 top-0 bottom-0 w-4 bg-white opacity-20 rounded-full"></div>
</div>
</div>
</div>
<!-- Controls -->
<div class="mt-10 flex gap-6">
<button aria-label="Retroceder 10 segundos" class="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-sm">
<span class="material-symbols-outlined" style="font-size: 28px;">replay_10</span>
</button>
<button aria-label="Pausar" class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined" style="font-size: 32px; font-variation-settings: 'FILL' 1;">pause</span>
</button>
<button aria-label="Detener" class="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-sm">
<span class="material-symbols-outlined" style="font-size: 28px;">stop</span>
</button>
</div>
</div>
</main>
<!-- Bottom Navigation Bar -->
<nav class="bg-surface-container-lowest fixed bottom-0 w-full z-50 rounded-t-xl shadow-[0_-4px_24px_0_rgba(45,90,240,0.08)] shadow-lg left-0 flex justify-around items-center px-4 py-2 pb-safe md:hidden">
<a class="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 hover:bg-surface-container-low rounded-xl group transition-colors" href="#">
<span class="material-symbols-outlined group-hover:opacity-80 transition-opacity">psychology</span>
<span class="font-label-sm text-label-sm mt-1">Gym</span>
</a>
<a class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1.5 hover:opacity-80 transition-opacity" href="#">
<span class="material-symbols-outlined">air</span>
<span class="font-label-sm text-label-sm mt-1 font-bold">Respirar</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 hover:bg-surface-container-low rounded-xl group transition-colors" href="#">
<span class="material-symbols-outlined group-hover:opacity-80 transition-opacity">task_alt</span>
<span class="font-label-sm text-label-sm mt-1">Hábitos</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 hover:bg-surface-container-low rounded-xl group transition-colors" href="#">
<span class="material-symbols-outlined group-hover:opacity-80 transition-opacity">person</span>
<span class="font-label-sm text-label-sm mt-1">Perfil</span>
</a>
</nav>
<!-- Desktop Nav Fallback (Hidden on Mobile) -->
<aside class="hidden md:flex flex-col w-64 bg-surface-container-lowest h-screen fixed left-0 top-0 border-r border-surface-variant z-50 pt-24 px-4">
<nav class="flex flex-col gap-2">
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors" href="#">
<span class="material-symbols-outlined">psychology</span>
<span class="font-body-md text-body-md">Gym</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container text-on-primary-container transition-colors" href="#">
<span class="material-symbols-outlined">air</span>
<span class="font-body-md text-body-md font-bold">Respirar</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors" href="#">
<span class="material-symbols-outlined">task_alt</span>
<span class="font-body-md text-body-md">Hábitos</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors" href="#">
<span class="material-symbols-outlined">person</span>
<span class="font-body-md text-body-md">Perfil</span>
</a>
</nav>
</aside>
</body></html>