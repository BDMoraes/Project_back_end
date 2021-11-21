class individuo {
    constructor(tarefas_parametro, eficiencia, cromossomo) {
        this.tarefas = tarefas_parametro;
        this.eficiencia = eficiencia;
        this.cromossomo = cromossomo;
        this.f_objetivo = function () {
            for (let index = 0; index < tarefas_parametro.length; index++) {
                this.cromossomo = this.cromossomo + ` ${this.tarefas[index].simbolo} `;
            }
        };
        this.f_eficiencia = function (tarefas_rec) {
            let calc_eficiencia = 0;
            let ciclo = tarefas_rec.length - 1;
            for (let index = 0; index < ciclo; index++) {
                if (tarefas_rec[index].grau > tarefas_rec[index + 1].grau) {
                    calc_eficiencia++;
                }
            }
            return calc_eficiencia;
        }
    }
}

function criar_populacao_inicial(tarefas, registros_geracao, tamanho_pop) {

    let cromossomo = "";

    let individuo01 = new individuo(tarefas, 0, cromossomo);

    let tam_temp = tamanho_pop;

    for (let index = 0; index < individuo01.tarefas.length; index++) {
        individuo01.tarefas[index].simbolo = index;
    }

    individuo01.eficiencia = individuo01.f_eficiencia(individuo01.tarefas);
    individuo01.f_objetivo();

    registros_geracao.push(individuo01);

    let populacao = 75;

    for (let index = 0; index < populacao; index++) {
        let random1 = Math.floor(Math.random() * tarefas.length);
        let random2 = Math.floor(Math.random() * tarefas.length);

        const individuo_novo = clonar(individuo01);

        individuo_novo.cromossomo = "";

        const auxiliar = clonar(individuo_novo.tarefas[random1]);
        individuo_novo.tarefas[random1] = clonar(individuo_novo.tarefas[random2]);
        individuo_novo.tarefas[random2] = clonar(auxiliar);
        individuo_novo.f_objetivo();
        const novo = new individuo(individuo_novo.tarefas, 0, individuo_novo.cromossomo);
        novo.eficiencia = novo.f_eficiencia(novo.tarefas);
        registros_geracao.push(novo);
    }

    tam_temp = registros_geracao.length;

    return tam_temp;
}

function selecao(tarefas, registros_geracao, tamanho_pop, mais_fitness, cont) {

    imprime_geracao(registros_geracao, mais_fitness, cont);

    registros_geracao.sort(function (a, b) {
        return a.eficiencia < b.eficiencia ? -1 : a.eficiencia > b.eficiencia ? 1 : 0;
    });

    let proxima_geracao = [];
    proxima_geracao.push(registros_geracao[0]);
    proxima_geracao.push(registros_geracao[1]);


    for (let index = 2; index < tamanho_pop; index++) {
        let random1 = Math.floor(Math.random() * registros_geracao.length);
        let random2 = Math.floor(Math.random() * registros_geracao.length);
        let random3 = Math.floor(Math.random() * registros_geracao.length);
        let random4 = Math.floor(Math.random() * registros_geracao.length);
        let indiv_pai = {};
        let indiv_mae = {};

        if (registros_geracao[random1].eficiencia <= registros_geracao[random2].eficiencia) {
            indiv_pai = clonar(registros_geracao[random1]);
        } else {
            indiv_pai = clonar(registros_geracao[random2]);
        }

        if (registros_geracao[random3].eficiencia <= registros_geracao[random4].eficiencia) {
            indiv_mae = clonar(registros_geracao[random3]);
        } else {
            indiv_mae = clonar(registros_geracao[random4]);
        }

        let tarefas_novas = crossover(tarefas, indiv_pai, indiv_mae);
        let novo = new individuo(tarefas_novas, 0, "");
        novo.f_objetivo();
        novo.eficiencia = novo.f_eficiencia(novo.tarefas);
        proxima_geracao.push(novo);
    }

    registros_geracao = [...proxima_geracao];
}

function crossover(tarefas, indiv_pai, indiv_mae) {
    let indiv_filho = [];
    let mascara = [];

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (let index = 0; index < tarefas.length; index++) {
        mascara[index] = getRandomIntInclusive(0, 1);
    }

    for (let index = 0; index < mascara.length; index++) {
        if (mascara[index] == 0) {
            indiv_filho[index] = clonar(indiv_mae.tarefas[index]);
        } else {
            indiv_filho[index] = clonar(indiv_pai.tarefas[index]);
        }
    }

    verificar_duplicados(tarefas, indiv_filho);

    return (indiv_filho);
}

function verificar_duplicados(tarefas, indiv_filho) {
    let existe = 0;
    let posicao_trocar = 0;
    let valor_trocar = [];
    let lista_auxiliar = [];
    for (let x = 0; x < tarefas.length; x++) {
        lista_auxiliar.push(indiv_filho[x].sequenciamento);
    }
    for (let x = 0; x < tarefas.length; x++) {
        if (lista_auxiliar.indexOf(x) == (-1)) {
            valor_trocar.push(x);
        }
    }
    for (let x = 0; x < tarefas.length; x++) {
        for (let y = 0; y < tarefas.length; y++) {
            existe = 0;
            if (lista_auxiliar[x] == lista_auxiliar[y] && (x != y)) {
                existe++;
                posicao_trocar = y;
            }
            if (existe > 0) {
                lista_auxiliar[posicao_trocar] = valor_trocar.shift();
            }
        }
    }

    for (let x = 0; x < tarefas.length; x++) {
        indiv_filho[x].sequenciamento = lista_auxiliar[x];
    }
}

function mutacao(tarefas, registros_geracao, tamanho_pop) {

    for (let index = 2; index < tamanho_pop; index++) {
        let random1 = Math.floor(Math.random() * tarefas.length);
        let random2 = Math.floor(Math.random() * tarefas.length);

        let individuo_novo = clonar(registros_geracao[index]);

        individuo_novo.cromossomo = "";

        let auxiliar = clonar(individuo_novo.tarefas[random1]);
        individuo_novo.tarefas[random1] = clonar(individuo_novo.tarefas[random2]);
        individuo_novo.tarefas[random2] = clonar(auxiliar);
        individuo_novo.f_objetivo();
        let novo = new individuo(individuo_novo.tarefas, 0, individuo_novo.cromossomo);
        novo.eficiencia = novo.f_eficiencia(novo.tarefas);
        registros_geracao[index] = clonar(novo);
    }
}

const clonar = obj => {

    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    let cloned, i;

    if (obj instanceof Date) {
        cloned = new Date(obj.getTime());
        return cloned;
    }

    if (obj instanceof Array) {
        let l;
        cloned = [];
        for (i = 0, l = obj.length; i < l; i++) {
            cloned[i] = clonar(obj[i]);
        }

        return cloned;
    }

    cloned = {};
    for (i in obj) if (obj.hasOwnProperty(i)) {
        cloned[i] = clonar(obj[i]);
    }

    return cloned;
}


function imprime_geracao(geracao_atual, mais_fitness, cont) {
    for (let index = 0; index < geracao_atual.length; index++) {
        if (geracao_atual[index].eficiencia == 0) {
            mais_fitness.push(geracao_atual[index]);
            break;
        }
    }
    cont++;
    geracao_atual.sort(function (a, b) {
        return a.eficiencia < b.eficiencia ? -1 : a.eficiencia > b.eficiencia ? 1 : 0;
    });

    melhor = geracao_atual[0];
}

function rodar(tarefas) {

    var registros_geracao = [];
    var tamanho_pop = 0;
    var melhor = {};
    var mais_fitness = [];
    var cont = 0;

    tamanho_pop = criar_populacao_inicial(tarefas, registros_geracao, tamanho_pop);

    do {
        selecao(tarefas, registros_geracao, tamanho_pop, mais_fitness, cont);
        mutacao(tarefas, registros_geracao, tamanho_pop);
    } while (mais_fitness.length == 0 && cont < 350);


    if (mais_fitness.length == 0) {
        return melhor;
    } else {
        return mais_fitness;
    }
}

module.exports = { rodar };