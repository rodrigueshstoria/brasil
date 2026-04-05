function generateIdeologyProfile(userAnswers) {
    let profile = [];

    // Guerra e Soberania (perguntas 0-2)
    const guerraScore = (userAnswers[0] + userAnswers[1] + userAnswers[2]) / 3;
    if (guerraScore > 3.5) {
        profile.push("Ofensivo");
    } else if (guerraScore < 2.5) {
        profile.push("Defensivo");
    } else {
        profile.push("Equilibrado em Guerra");
    }

    // Alianças (3-5)
    const aliancasScore = (userAnswers[3] + userAnswers[4] + userAnswers[5]) / 3;
    if (aliancasScore > 3.5) {
        profile.push("Líder Aliancista");
    } else if (aliancasScore < 2.5) {
        profile.push("Parceiro Estratégico");
    } else {
        profile.push("Moderado em Alianças");
    }

    // Economia (do jogo) (6-8)
    const economiaScore = (userAnswers[6] + userAnswers[7] + userAnswers[8]) / 3;
    if (economiaScore > 3.5) {
        profile.push("Coletivista");
    } else if (economiaScore < 2.5) {
        profile.push("Individualista");
    } else {
        profile.push("Equilibrado Economicamente");
    }

    // Política (9-11)
    const politicoScore = (userAnswers[9] + userAnswers[10] + userAnswers[11]) / 3;
    if (politicoScore > 3.5) {
        profile.push("Centralizado");
    } else if (politicoScore < 2.5) {
        profile.push("Distribuído");
    } else {
        profile.push("Moderado Politicamente");
    }

    // Organização (12-14)
    const organizacaoScore = (userAnswers[12] + userAnswers[13]) / 2; // sem a última
    if (organizacaoScore > 3.5) {
        profile.push("Hierárquico");
    } else if (organizacaoScore < 2.5) {
        profile.push("Igualitário");
    } else {
        profile.push("Equilibrado em Estilo");
    }

    // Leve: Cães vs Gatos
    if (userAnswers[14] > 3) {
        profile.push("Pró-Cães");
    } else if (userAnswers[14] < 3) {
        profile.push("Pró-Gatos");
    } else {
        profile.push("Neutro em Pets");
    }

    return profile.join(" | ");
}