package br.edu.ifgoiano.lista.exercicio1_2;

import java.util.*;

public class Grafo {
    private Map<String, List<Edge>> listaAdjacenci;
    private boolean direcao;

    public Grafo(boolean direcao) {
        this.direcao = direcao;
        this.listaAdjacenci = new HashMap<>();
    }

    public void addNo(String node){
        listaAdjacenci.putIfAbsent(node, new ArrayList<>());
    }

    public void addEdge(String origem, String destino, int peso){
        addNo(origem);
        addNo(destino);

        listaAdjacenci.get(origem).add(new Edge(destino, peso));

        if (!direcao){
            listaAdjacenci.get(destino).add(new Edge(origem, peso));
        }
    }

    public List<Edge> getListaAdjacenci(String node) {
        return listaAdjacenci.get(node);
    }

}
