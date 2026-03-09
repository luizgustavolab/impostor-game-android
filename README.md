# Impostor Game Android

Desenvolvido por [luizgustavolab](https://github.com/luizgustavolab)

Um jogo de dedução social moderno, em Português, construído com React Native e Expo, focado em jogabilidade dinâmica e interface intuitiva. O objetivo é identificar o impostor antes que ele descubra a palavra secreta do grupo.

## 🚀 Funcionalidades

* **Modo Cego (Dica para Impostor):** Opção selecionável para ocultar a palavra-chave do impostor, elevando o nível de dificuldade.
* **Lista de Palavras Curada:** Mais de 100 termos selecionados por ambiguidade para gerar debates intensos.
* **Persistência de Dados:** Armazenamento local de configurações e palavras já utilizadas para evitar repetições.
* **Interface Animada:** Uso de `Animated` API e `PanResponder` para uma experiência fluida de "arrastar para revelar".

## 🛠️ Tecnologias Utilizadas

* **React Native / Expo** - Framework principal para desenvolvimento cross-platform.
* **AsyncStorage** - Gerenciamento de persistência de dados locais.
* **Lucide-react-native** - Biblioteca de ícones.
* **React Navigation** - Gestão de rotas e fluxo entre telas.

## 📦 Como Executar o Projeto

1. Clone o repositório:
    ```bash
    git clone [https://github.com/luizgustavolab/impostor-game-android.git](https://github.com/luizgustavolab/impostor-game-android.git)
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Inicie o servidor do Expo:
    ```bash
    npx expo start
    ```

4. Escaneie o QR Code com o app **Expo Go** (Android/iOS).

## 📜 Histórico de Versões (Commits)

* `feat: initial commit with game logic, imposter hint toggle and refined word list` - Estrutura base, lógica de sorteio e lista de palavras ambíguas.
* `docs: create project documentation` - Criação do README detalhado e guia de instalação.
* `refactor: simplify word list and remove compound terms` - Refatoração da lista para palavras simples e únicas.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✉️ Contato

Desenvolvido por **Luiz Gustavo**.  
Conecte-se comigo:  
[GitHub](https://github.com/luizgustavolab) 

## 📲 Download (Beta Android)

Você pode baixar e testar a versão atual do jogo diretamente no seu Android através do link abaixo:

* [Baixar Impostor Game (APK)](https://expo.dev/artifacts/eas/tRBggDfp26t44Vu2Vfu5DF.apk)

> **Nota:** Por ser um instalador independente (fora da Play Store), o Android pode exibir um aviso de "Fonte Desconhecida". Pode prosseguir com a instalação com segurança.