package br.edu.ifgoiano.lista.exercicio1_2;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        Grafo g = new Grafo(true);

        g.addEdge("A", "B", 1);
        g.addEdge("A", "C", 1);
        g.addEdge("B", "D", 1);
        g.addEdge("B", "E", 1);
        g.addEdge("C", "F", 1);
        g.addEdge("E", "G", 1);
        g.addEdge("F", "G", 1);
        g.addNo("D");
        g.addNo("G");

        List<Vertice> vertices = g.getVertices();

        for (Vertice vertice : vertices) {
            vertice.verArestas();
        }

        System.out.println("Os grafos em DFS" + g.dfs("A"));
        System.out.println("-----------------------------------");
        System.out.println("Os grafos em BFS" + g.bfs("A"));

    }


}