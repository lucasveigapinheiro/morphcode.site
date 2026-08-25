import base64
from pathlib import Path

logo_b64 = Path('public/logo.jpeg').read_bytes()
logo_uri = 'data:image/jpeg;base64,' + base64.b64encode(logo_b64).decode()

BRAND_PRIMARY = "#d4a94a"
BRAND_LIGHT = "#e8c876"
BRAND_DARK = "#b3883b"
LIGHT_BG = "#f5f4f0"
LIGHT_BORDER = "#e0ded9"
DARK_BG = "#0a0a0a"
BRAND_GRADIENT = f"linear-gradient(165deg, {BRAND_DARK} 0%, {BRAND_PRIMARY} 50%, {BRAND_LIGHT} 100%)"

HTML_TEMPLATE = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram Carousel Preview</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@300;600;700&display=swap" rel="stylesheet">
    <style>
        :root {{
            --brand: {{BRAND_PRIMARY}};
            --brand-light: {{BRAND_LIGHT}};
            --brand-dark: {{BRAND_DARK}};
            --light-bg: {{LIGHT_BG}};
            --light-border: {{LIGHT_BORDER}};
            --dark-bg: {{DARK_BG}};
        }}
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            background: #2a2a2a;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 20px;
        }}
        
        .serif {{ font-family: 'Sora', sans-serif; }}
        .sans {{ font-family: 'Inter', sans-serif; }}
        
        /* IG Frame */
        .ig-frame {{
            width: 420px;
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }}
        .ig-header {{
            display: flex;
            align-items: center;
            padding: 14px 16px;
            gap: 12px;
            border-bottom: 1px solid #efefef;
        }}
        .ig-avatar {{
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: {BRAND_PRIMARY};
            padding: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }}
        .ig-avatar img {{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }}
        .ig-handle-container {{
            flex: 1;
            display: flex;
            flex-direction: column;
        }}
        .ig-handle {{ font-size: 14px; font-weight: 600; color: #262626; }}
        .ig-subtitle {{ font-size: 12px; color: #8e8e8e; }}
        
        /* Carousel Viewport */
        .carousel-viewport {{
            width: 420px;
            height: 525px; /* 4:5 aspect ratio */
            position: relative;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
        }}
        .carousel-viewport::-webkit-scrollbar {{ display: none; }}
        
        .carousel-track {{
            display: flex;
            height: 100%;
            width: max-content;
        }}
        
        .slide {{
            width: 420px;
            height: 525px;
            scroll-snap-align: start;
            position: relative;
            display: flex;
            flex-direction: column;
            padding: 0 36px;
            overflow: hidden;
        }}
        
        .slide-content {{
            z-index: 2;
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
        }}
        
        /* Bottom-aligned with space for progress */
        .layout-bottom {{
            justify-content: flex-end;
            padding-bottom: 52px;
        }}
        .layout-center {{
            justify-content: center;
        }}
        
        h1, h2 {{
            font-size: 32px;
            font-weight: 600;
            letter-spacing: -0.5px;
            line-height: 1.15;
            margin-bottom: 16px;
        }}
        p.body {{
            font-size: 14px;
            line-height: 1.55;
            font-weight: 400;
        }}
        
        .tag {{
            display: inline-block;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 16px;
        }}
        
        /* IG Actions */
        .ig-actions {{
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
        }}
        .ig-icons {{ display: flex; gap: 16px; }}
        .ig-caption {{
            padding: 0 16px 16px;
            font-size: 14px;
        }}
        .ig-caption span.handle {{ font-weight: 600; margin-right: 4px; }}
        .ig-time {{ font-size: 10px; color: #8e8e8e; margin-top: 8px; text-transform: uppercase; }}
        
        /* Logo lockup */
        .logo-lockup {{
            display: flex;
            align-items: center;
            gap: 10px;
            position: absolute;
            top: 32px;
            left: 36px;
            z-index: 10;
        }}
        .logo-lockup .logo-circle {{
            width: 40px; height: 40px; border-radius: 50%;
            background: #fff;
            padding: 2px;
            overflow: hidden;
            display: flex; align-items: center; justify-content: center;
        }}
        .logo-lockup .logo-circle img {{
            width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
        }}
        .logo-lockup .brand-name {{
            font-size: 13px; font-weight: 600; letter-spacing: 0.5px;
        }}
    </style>
</head>
<body>

<div class="ig-frame">
    <!-- Header -->
    <div class="ig-header">
        <div class="ig-avatar"><img src="{logo_uri}" alt="Morph Code"></div>
        <div class="ig-handle-container">
            <span class="ig-handle">morphcode</span>
            <span class="ig-subtitle">Tecnologia e Sistemas</span>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-left:auto"><circle cx="12" cy="12" r="1.5" fill="#262626"/><circle cx="19" cy="12" r="1.5" fill="#262626"/><circle cx="5" cy="12" r="1.5" fill="#262626"/></svg>
    </div>

    <!-- Viewport -->
    <div class="carousel-viewport">
        <div class="carousel-track">
            
            <!-- SLIDE 1: Hook -->
            <div class="slide layout-center" style="background: {LIGHT_BG};">
                <div class="logo-lockup">
                    <div class="logo-circle"><img src="{logo_uri}"></div>
                    <span class="sans brand-name" style="color: {DARK_BG}">Morph Code</span>
                </div>
                
                <div class="slide-content layout-center">
                    <span class="sans tag" style="color: {BRAND_PRIMARY};">A DOR DO CRESCIMENTO</span>
                    <h1 class="serif" style="color: {DARK_BG}; font-size: 34px;">Processos manuais estão engolindo o lucro da sua empresa.</h1>
                    <p class="sans body" style="color: #666; margin-top: 12px; font-size: 15px;">Quantas horas sua equipe perdeu hoje copiando e colando dados?</p>
                </div>
                
                <!-- Arrow -->
                <div style="position:absolute;right:0;top:0;bottom:0;width:48px;z-index:9;display:flex;align-items:center;justify-content:center;background:linear-gradient(to right,transparent,rgba(0,0,0,0.06));">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke="rgba(0,0,0,0.25)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <!-- Progress -->
                <div style="position:absolute;bottom:0;left:0;right:0;padding:16px 28px 20px;z-index:10;display:flex;align-items:center;gap:10px;">
                    <div style="flex:1;height:3px;background:rgba(0,0,0,0.08);border-radius:2px;overflow:hidden;">
                      <div style="height:100%;width:14.28%;background:{BRAND_PRIMARY};border-radius:2px;"></div>
                    </div>
                    <span class="sans" style="font-size:11px;color:rgba(0,0,0,0.3);font-weight:500;">1/7</span>
                </div>
            </div>
            
            <!-- SLIDE 2: Problem -->
            <div class="slide layout-bottom" style="background: {DARK_BG};">
                <div class="slide-content layout-bottom">
                    <span class="sans tag" style="color: {BRAND_LIGHT};">O CUSTO INVISÍVEL</span>
                    <h2 class="serif" style="color: #fff;">Não ter um sistema custa mais caro do que construir um.</h2>
                    <p class="sans body" style="color: rgba(255,255,255,0.7); margin-bottom: 24px;">Você já calculou o impacto financeiro de:</p>
                    
                    <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);">
                      <span style="color:{BRAND_PRIMARY};font-size:16px;width:18px;text-align:center;">✕</span>
                      <div>
                        <span class="sans" style="font-size:14px;font-weight:600;color:#fff;">Planilhas perdidas</span>
                        <span class="sans" style="display:block;font-size:12px;color:rgba(255,255,255,0.5);margin-top:2px;">Informações descentralizadas e confusas</span>
                      </div>
                    </div>
                    
                    <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);">
                      <span style="color:{BRAND_PRIMARY};font-size:16px;width:18px;text-align:center;">✕</span>
                      <div>
                        <span class="sans" style="font-size:14px;font-weight:600;color:#fff;">Trabalho duplicado</span>
                        <span class="sans" style="display:block;font-size:12px;color:rgba(255,255,255,0.5);margin-top:2px;">A mesma tarefa feita duas ou três vezes</span>
                      </div>
                    </div>
                    
                    <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;">
                      <span style="color:{BRAND_PRIMARY};font-size:16px;width:18px;text-align:center;">✕</span>
                      <div>
                        <span class="sans" style="font-size:14px;font-weight:600;color:#fff;">Decisões no escuro</span>
                        <span class="sans" style="display:block;font-size:12px;color:rgba(255,255,255,0.5);margin-top:2px;">Falta de dados em tempo real para agir</span>
                      </div>
                    </div>
                </div>
                
                <!-- Arrow -->
                <div style="position:absolute;right:0;top:0;bottom:0;width:48px;z-index:9;display:flex;align-items:center;justify-content:center;background:linear-gradient(to right,transparent,rgba(255,255,255,0.08));">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <!-- Progress -->
                <div style="position:absolute;bottom:0;left:0;right:0;padding:16px 28px 20px;z-index:10;display:flex;align-items:center;gap:10px;">
                    <div style="flex:1;height:3px;background:rgba(255,255,255,0.12);border-radius:2px;overflow:hidden;">
                      <div style="height:100%;width:28.57%;background:#fff;border-radius:2px;"></div>
                    </div>
                    <span class="sans" style="font-size:11px;color:rgba(255,255,255,0.4);font-weight:500;">2/7</span>
                </div>
            </div>
            
            <!-- SLIDE 3: Insight / Solution Pivot -->
            <div class="slide layout-center" style="background: {BRAND_GRADIENT};">
                <div class="slide-content layout-center">
                    <div style="padding:24px;background:rgba(0,0,0,0.15);border-radius:16px;border:1px solid rgba(255,255,255,0.15);">
                      <p class="sans" style="font-size:12px;font-weight:600;letter-spacing:1px;color:rgba(255,255,255,0.8);margin-bottom:12px;">A GRANDE VERDADE</p>
                      <p class="serif" style="font-size:24px;color:#fff;font-weight:600;line-height:1.3;">"Você não precisa contratar mais pessoas. Você precisa de automação e tecnologia."</p>
                    </div>
                </div>
                
                <!-- Arrow -->
                <div style="position:absolute;right:0;top:0;bottom:0;width:48px;z-index:9;display:flex;align-items:center;justify-content:center;background:linear-gradient(to right,transparent,rgba(0,0,0,0.06));">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke="rgba(255,255,255,0.6)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <!-- Progress -->
                <div style="position:absolute;bottom:0;left:0;right:0;padding:16px 28px 20px;z-index:10;display:flex;align-items:center;gap:10px;">
                    <div style="flex:1;height:3px;background:rgba(255,255,255,0.15);border-radius:2px;overflow:hidden;">
                      <div style="height:100%;width:42.85%;background:#fff;border-radius:2px;"></div>
                    </div>
                    <span class="sans" style="font-size:11px;color:rgba(255,255,255,0.6);font-weight:500;">3/7</span>
                </div>
            </div>
            
            <!-- SLIDE 4: Solution Features -->
            <div class="slide layout-bottom" style="background: {LIGHT_BG};">
                <div class="slide-content layout-bottom">
                    <span class="sans tag" style="color: {BRAND_PRIMARY};">A SOLUÇÃO</span>
                    <h2 class="serif" style="color: {DARK_BG};">O que muda com um sistema sob medida:</h2>
                    
                    <div style="margin-top: 24px;">
                        <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;border-bottom:1px solid {LIGHT_BORDER};">
                          <span style="color:{BRAND_PRIMARY};font-size:18px;width:24px;text-align:center;">✓</span>
                          <div>
                            <span class="sans" style="font-size:14px;font-weight:600;color:{DARK_BG};">Automação Inteligente</span>
                            <span class="sans" style="display:block;font-size:12px;color:#8A8580;margin-top:2px;">Tarefas operacionais rodam sozinhas</span>
                          </div>
                        </div>
                        <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;border-bottom:1px solid {LIGHT_BORDER};">
                          <span style="color:{BRAND_PRIMARY};font-size:18px;width:24px;text-align:center;">✓</span>
                          <div>
                            <span class="sans" style="font-size:14px;font-weight:600;color:{DARK_BG};">Dados Centralizados</span>
                            <span class="sans" style="display:block;font-size:12px;color:#8A8580;margin-top:2px;">Informação em um só lugar, acessível e segura</span>
                          </div>
                        </div>
                        <div style="display:flex;align-items:flex-start;gap:14px;padding:12px 0;border-bottom:1px solid {LIGHT_BORDER};">
                          <span style="color:{BRAND_PRIMARY};font-size:18px;width:24px;text-align:center;">✓</span>
                          <div>
                            <span class="sans" style="font-size:14px;font-weight:600;color:{DARK_BG};">Escala sem Atrito</span>
                            <span class="sans" style="display:block;font-size:12px;color:#8A8580;margin-top:2px;">O sistema cresce junto com a sua empresa</span>
                          </div>
                        </div>
                    </div>
                </div>
                
                <!-- Arrow -->
                <div style="position:absolute;right:0;top:0;bottom:0;width:48px;z-index:9;display:flex;align-items:center;justify-content:center;background:linear-gradient(to right,transparent,rgba(0,0,0,0.06));">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke="rgba(0,0,0,0.25)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <!-- Progress -->
                <div style="position:absolute;bottom:0;left:0;right:0;padding:16px 28px 20px;z-index:10;display:flex;align-items:center;gap:10px;">
                    <div style="flex:1;height:3px;background:rgba(0,0,0,0.08);border-radius:2px;overflow:hidden;">
                      <div style="height:100%;width:57.14%;background:{BRAND_PRIMARY};border-radius:2px;"></div>
                    </div>
                    <span class="sans" style="font-size:11px;color:rgba(0,0,0,0.3);font-weight:500;">4/7</span>
                </div>
            </div>
            
            <!-- SLIDE 5: Details -->
            <div class="slide layout-center" style="background: {DARK_BG};">
                <div class="slide-content layout-center">
                    <span class="sans tag" style="color: {BRAND_LIGHT};">DIFERENCIAL</span>
                    <h2 class="serif" style="color: #fff;">Não é sobre ter mais ferramentas. É sobre ter a ferramenta certa.</h2>
                    <p class="sans body" style="color: rgba(255,255,255,0.7); margin-bottom: 24px;">Softwares de prateleira forçam você a adaptar seus processos a eles.</p>
                    <div style="padding:16px;background:rgba(255,255,255,0.05);border-radius:12px;border:1px solid rgba(255,255,255,0.1);">
                        <p class="sans body" style="color: #fff; font-weight: 500;">Um sistema sob medida se molda exatamente à forma como o seu negócio opera.</p>
                    </div>
                </div>
                
                <!-- Arrow -->
                <div style="position:absolute;right:0;top:0;bottom:0;width:48px;z-index:9;display:flex;align-items:center;justify-content:center;background:linear-gradient(to right,transparent,rgba(255,255,255,0.08));">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <!-- Progress -->
                <div style="position:absolute;bottom:0;left:0;right:0;padding:16px 28px 20px;z-index:10;display:flex;align-items:center;gap:10px;">
                    <div style="flex:1;height:3px;background:rgba(255,255,255,0.12);border-radius:2px;overflow:hidden;">
                      <div style="height:100%;width:71.42%;background:#fff;border-radius:2px;"></div>
                    </div>
                    <span class="sans" style="font-size:11px;color:rgba(255,255,255,0.4);font-weight:500;">5/7</span>
                </div>
            </div>
            
            <!-- SLIDE 6: How-to -->
            <div class="slide layout-bottom" style="background: {LIGHT_BG};">
                <div class="slide-content layout-bottom">
                    <span class="sans tag" style="color: {BRAND_PRIMARY};">COMO FUNCIONA</span>
                    <h2 class="serif" style="color: {DARK_BG};">O caminho para escalar sem atrito:</h2>
                    
                    <div style="margin-top: 16px;">
                        <div style="display:flex;align-items:flex-start;gap:16px;padding:14px 0;border-bottom:1px solid {LIGHT_BORDER};">
                          <span class="serif" style="font-size:26px;font-weight:300;color:{BRAND_PRIMARY};min-width:34px;line-height:1;">01</span>
                          <div>
                            <span class="sans" style="font-size:14px;font-weight:600;color:{DARK_BG};">Imersão</span>
                            <span class="sans" style="display:block;font-size:12px;color:#8A8580;margin-top:2px;">Entendemos seus gargalos atuais.</span>
                          </div>
                        </div>
                        <div style="display:flex;align-items:flex-start;gap:16px;padding:14px 0;border-bottom:1px solid {LIGHT_BORDER};">
                          <span class="serif" style="font-size:26px;font-weight:300;color:{BRAND_PRIMARY};min-width:34px;line-height:1;">02</span>
                          <div>
                            <span class="sans" style="font-size:14px;font-weight:600;color:{DARK_BG};">Desenvolvimento</span>
                            <span class="sans" style="display:block;font-size:12px;color:#8A8580;margin-top:2px;">Construímos a solução exata para o seu processo.</span>
                          </div>
                        </div>
                        <div style="display:flex;align-items:flex-start;gap:16px;padding:14px 0;">
                          <span class="serif" style="font-size:26px;font-weight:300;color:{BRAND_PRIMARY};min-width:34px;line-height:1;">03</span>
                          <div>
                            <span class="sans" style="font-size:14px;font-weight:600;color:{DARK_BG};">Escala</span>
                            <span class="sans" style="display:block;font-size:12px;color:#8A8580;margin-top:2px;">Sua equipe foca no que importa. O sistema faz o resto.</span>
                          </div>
                        </div>
                    </div>
                </div>
                
                <!-- Arrow -->
                <div style="position:absolute;right:0;top:0;bottom:0;width:48px;z-index:9;display:flex;align-items:center;justify-content:center;background:linear-gradient(to right,transparent,rgba(0,0,0,0.06));">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke="rgba(0,0,0,0.25)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <!-- Progress -->
                <div style="position:absolute;bottom:0;left:0;right:0;padding:16px 28px 20px;z-index:10;display:flex;align-items:center;gap:10px;">
                    <div style="flex:1;height:3px;background:rgba(0,0,0,0.08);border-radius:2px;overflow:hidden;">
                      <div style="height:100%;width:85.71%;background:{BRAND_PRIMARY};border-radius:2px;"></div>
                    </div>
                    <span class="sans" style="font-size:11px;color:rgba(0,0,0,0.3);font-weight:500;">6/7</span>
                </div>
            </div>
            
            <!-- SLIDE 7: CTA -->
            <div class="slide layout-center" style="background: {BRAND_GRADIENT};">
                <div class="logo-lockup" style="top: 32px; left: 36px;">
                    <div class="logo-circle"><img src="{logo_uri}"></div>
                    <span class="sans brand-name" style="color: #fff">Morph Code</span>
                </div>
                
                <div class="slide-content layout-center">
                    <h1 class="serif" style="color: #fff; text-align: left;">Pronto para automatizar a sua operação?</h1>
                    <p class="sans body" style="color: rgba(255,255,255,0.9); margin-top: 16px; margin-bottom: 32px;">Deixe a tecnologia trabalhar por você.</p>
                    
                    <div>
                        <div style="display:inline-flex;align-items:center;justify-content:center;padding:14px 28px;background:{LIGHT_BG};color:{DARK_BG};font-family:'Inter',sans-serif;font-weight:600;font-size:14px;border-radius:28px;">
                            Acesse o link na bio
                        </div>
                    </div>
                </div>
                
                <!-- Progress (100%, NO ARROW) -->
                <div style="position:absolute;bottom:0;left:0;right:0;padding:16px 28px 20px;z-index:10;display:flex;align-items:center;gap:10px;">
                    <div style="flex:1;height:3px;background:rgba(255,255,255,0.15);border-radius:2px;overflow:hidden;">
                      <div style="height:100%;width:100%;background:#fff;border-radius:2px;"></div>
                    </div>
                    <span class="sans" style="font-size:11px;color:rgba(255,255,255,0.8);font-weight:500;">7/7</span>
                </div>
            </div>
            
        </div>
    </div>
    
    <!-- Instagram Footer / Actions -->
    <div class="ig-actions">
        <div class="ig-icons">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </div>
        <div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </div>
    </div>
    <div class="ig-caption">
        <span class="sans handle">morphcode</span> <span class="sans">Seu tempo é o recurso mais valioso. Não desperdice com tarefas que um sistema pode fazer por você. ✨</span>
        <div class="sans ig-time">HÁ 2 HORAS</div>
    </div>
</div>

<script>
    const slider = document.querySelector('.carousel-viewport');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {{
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }});
    slider.addEventListener('mouseleave', () => {{
        isDown = false;
        slider.style.cursor = 'auto';
    }});
    slider.addEventListener('mouseup', () => {{
        isDown = false;
        slider.style.cursor = 'auto';
    }});
    slider.addEventListener('mousemove', (e) => {{
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    }});
</script>

</body>
</html>
'''

Path('carousel.html').write_text(HTML_TEMPLATE, encoding='utf-8')
print("HTML generated.")
