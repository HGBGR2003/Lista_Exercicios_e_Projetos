package br.edu.ifgoiano.lista.exercicio1_2;

import java.util.*;

public class Grafo {
    private Map<String, List<Edge>> listaAdjacencia;
    private boolean direcao;

    public Grafo(boolean direcao) {
        this.direcao = direcao;
        this.listaAdjacencia = new HashMap<>();
    }

    public void addNo(String node){
        listaAdjacencia.putIfAbsent(node, new ArrayList<>());
    }

    public void addEdge(String origem, String destino, int peso){
        addNo(origem);
        addNo(destino);

        listaAdjacencia.get(origem).add(new Edge(destino, peso));

        if (!direcao){
            listaAdjacencia.get(destino).add(new Edge(origem, peso));
        }
    }

    public List<Edge> getListaAdjacenci(String node) {
        return listaAdjacencia.getOrDefault(node, Collections.emptyList());
    }

    public List<String> bfs(String inicio) {
        Set<String> visitados = new LinkedHashSet<>();
        Queue<String> fila = new LinkedList<>();

        fila.add(inicio);
        visitados.add(inicio);

        while (!fila.isEmpty()) {
            String no = fila.poll();
            for (Edge edge : getListaAdjacenci(no)) {
                if (!visitados.contains(edge.getDestino())) {
                    visitados.add(edge.getDestino());
                    fila.add(edge.getDestino());
                }
            }
        }
        return new ArrayList<>(visitados);
    }

    public List<String> dfs(String inicio) {
        Set<String> visitados = new LinkedHashSet<>();
        dfsRecursivo(inicio, visitados);
        return new ArrayList<>(visitados);
    }

    private void dfsRecursivo(String no, Set<String> visitados) {
        visitados.add(no);
        for (Edge edge : getListaAdjacenci(no)) {
            if (!visitados.contains(edge.getDestino())) {
                dfsRecursivo(edge.getDestino(), visitados);
            }
        }
    }


    public List<Vertice> getVertices() {
        List<Vertice> vertices = new ArrayList<>();
        for (Map.Entry<String, List<Edge>> entry : listaAdjacencia.entrySet()) {
            vertices.add(new Vertice(entry.getKey(), entry.getValue()));
        }
        return vertices;
    }

    }

