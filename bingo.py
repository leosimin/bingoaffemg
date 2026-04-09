import streamlit as st
from streamlit_autorefresh import st_autorefresh

# 1. Configuração da página - DEVE SER A PRIMEIRA LINHA
st.set_page_config(page_title="Bingo Encontro de Pensionistas AFFEMG", layout="wide")

# --- AUTOREFRESH (PARA O TELÃO ATUALIZAR SOZINHO) ---
# Atualiza a tela automaticamente a cada 3 segundos
st_autorefresh(interval=3000, key="bingofresher")

# --- FUNÇÃO DE SINCRONIZAÇÃO (BINGO COMPARTILHADO) ---
@st.cache_resource
def iniciar_bingo_compartilhado():
    # Isso cria uma lista que todos os usuários conectados verão igual
    return {"lista": []}

# Conecta ao estado global
bingo_global = iniciar_bingo_compartilhado()

# --- DICIONÁRIO DE APELIDOS DAS PEDRAS ---
APELIDOS = {
    1: "Começou o jogo! O pequeno polegar.",
    10: "Craque de bola!",
    11: "Pernas de cambito!",
    13: "Galo Forte e Vingador! 🐓",
    18: "Idade da liberdade!",
    22: "Dois patinhos na lagoa! 🦆🦆",
    31: "Tudo que cai, cai em pé!",
    33: "Idade de Cristo!",
    45: "Fim do primeiro tempo!",
    50: "Meio século!",
    51: "Uma boa ideia! 🥃",
    60: "E o tempo passa...",
    66: "Um meia seis ou meia dúzia?",
    75: "Fim da linha! É o fim do globo!"
}

# --- ESTILIZAÇÃO CSS (VISUAL DIVERTIDO E GIGANTE) ---
st.markdown("""
    <style>
    .titulo-principal {
        font-size: 70px !important;
        font-weight: 800;
        color: #FF4B4B;
        text-align: center;
        text-shadow: 2px 2px #ffeb3b;
        margin-bottom: 0px;
    }
    .frase-efeito {
        font-size: 25px !important;
        font-style: italic;
        color: #1E88E5;
        text-align: center;
        margin-bottom: 30px;
        font-weight: bold;
    }
    .stButton button {
        height: 85px !important;
        font-size: 40px !important;
        font-weight: bold !important;
        border-radius: 50% !important;
        border: 3px solid #d1d3d8 !important;
    }
    div.stButton > button:first-child[kind="primary"] {
        background-color: #28a745 !important;
        color: white !important;
        border: 4px solid #ffeb3b !important;
        box-shadow: 0px 0px 15px rgba(40, 167, 69, 0.7);
    }
    .ultima-pedra-container {
        background-color: #FFF9C4;
        border-radius: 200px;
        padding: 20px;
        text-align: center;
        border: 5px dashed #FFD600;
        max-width: 800px;
        margin: 0 auto;
    }
    .ultima-pedra-numero { 
        font-size: 160px !important; 
        font-weight: 900; 
        color: #D32F2F; 
        margin: 0px;
        line-height: 1.1;
    }
    .apelido-pedra {
        font-size: 45px !important;
        color: #1E88E5;
        font-weight: bold;
        margin-top: -10px;
    }
    .historico-caixa {
        background-color: #E3F2FD;
        padding: 15px;
        border-radius: 15px;
        text-align: center;
        border: 2px solid #2196F3;
        margin-top: 20px;
    }
    </style>
    """, unsafe_allow_html=True)

# --- CABEÇALHO COM LOGO ---
# Corrigido: definindo 3 colunas explicitamente
col_logo1, col_logo2, col_logo3 = st.columns(3) 
with col_logo2:
    st.image("https://cdn.prod.website-files.com/5e18db1989b3944e9ee4778b/5e43078c68b52b8cba3ac668_Logo-AFFEMG_256x.png", width=300)

st.markdown('<p class="titulo-principal">🎊 BINGO AFFEMG 🎊</p>', unsafe_allow_html=True)
st.markdown('<p class="frase-efeito">Encontro de Pensionistas: Alegria e Sorte!</p>', unsafe_allow_html=True)

# --- 3. CONTROLE DO ALEXANDRE ---
with st.expander("⚙️ PAINEL DE CONTROLE (Alexandre)", expanded=True):
    # Corrigido: definindo 2 colunas explicitamente
    c1, c2 = st.columns(2) 
    with c1:
        entrada = st.number_input("Digite o número sorteado (1-75):", min_value=1, max_value=75, step=1, value=None)
        if entrada and entrada not in bingo_global["lista"]:
            bingo_global["lista"].append(entrada)
            st.rerun()
    with c2:
        st.write("###")
        if st.button("LIMPAR TUDO / NOVO JOGO", type="secondary", use_container_width=True):
            bingo_global["lista"].clear()
            st.rerun()

# --- 4. EXIBIÇÃO PARA O TELÃO ---
if bingo_global["lista"]:
    ultimo = bingo_global["lista"][-1]
    apelido = APELIDOS.get(ultimo, "")
    
    st.markdown(f"""
        <div class="ultima-pedra-container">
            <span style="font-size: 30px; font-weight: bold; color: #555;">SORTEADA:</span>
            <p class="ultima-pedra-numero">{ultimo}</p>
            <p class="apelido-pedra">{apelido}</p>
        </div>
    """, unsafe_allow_html=True)
    
    historico_texto = " • ".join(map(str, bingo_global["lista"]))
    st.markdown(f"""
        <div class="historico-caixa">
            <span style="font-size: 22px; font-weight: bold;">PEDRAS JÁ SORTEADAS:</span><br>
            <span style="font-size: 35px; color: #0D47A1; font-weight: bold;">{historico_texto}</span>
        </div>
    """, unsafe_allow_html=True)
else:
    st.markdown('<div class="ultima-pedra-container"><p style="font-size: 40px; color: gray; font-weight: bold; padding: 40px;">AGUARDANDO SORTEIO...</p></div>', unsafe_allow_html=True)

st.write("---")

# --- 5. GRADE GERAL (1-75) ---
for row in range(5):
    # Corrigido: definindo 15 colunas explicitamente
    cols = st.columns(15) 
    for col_idx in range(15):
        num = row * 15 + col_idx + 1
        if num <= 75:
            with cols[col_idx]:
                if num in bingo_global["lista"]:
                    if st.button(f"{num}", key=f"btn_{num}", use_container_width=True, type="primary"):
                        bingo_global["lista"].remove(num)
                        st.rerun()
                else:
                    if st.button(f"{num}", key=f"btn_{num}", use_container_width=True):
                        bingo_global["lista"].append(num)
                        st.rerun()
