/**
 * Core logic for graph processing
 */
class GraphProcessor {
  constructor() {
    this.userId = "pushkrajnaik_20051130";
    this.emailId = "pushkraj.naik.btech2023@sitpune.edu.in";
    this.enrollmentNumber = "23070122169";
  }

  process(edgesInput) {
    const invalid_entries = [];
    const duplicate_edges = [];
    const valid_edges = [];
    const seen_edges = new Set();
    const child_to_first_parent = new Map();

    // 1. Validation and Filtering
    edgesInput.forEach((entry) => {
      const trimmed = entry.trim();
      // Regex: Single uppercase letter -> Arrow -> Single uppercase letter
      if (!/^[A-Z]->[A-Z]$/.test(trimmed)) {
        invalid_entries.push(trimmed);
        return;
      }

      const [parent, child] = trimmed.split("->");

      // Self-loop check
      if (parent === child) {
        invalid_entries.push(trimmed);
        return;
      }

      // Duplicate check
      if (seen_edges.has(trimmed)) {
        if (!duplicate_edges.includes(trimmed)) {
          duplicate_edges.push(trimmed);
        }
        return;
      }
      seen_edges.add(trimmed);

      // Multi-parent check (First parent wins)
      if (child_to_first_parent.has(child)) {
        // Silently discard as per requirement rule 4
        return;
      }

      child_to_first_parent.set(child, parent);
      valid_edges.push({ parent, child });
    });

    // 2. Build Adjacency List and Node Set
    const adj = new Map();
    const all_nodes = new Set();
    const in_degree = new Map();

    valid_edges.forEach(({ parent, child }) => {
      if (!adj.has(parent)) adj.set(parent, []);
      adj.get(parent).push(child);
      all_nodes.add(parent);
      all_nodes.add(child);
      in_degree.set(child, (in_degree.get(child) || 0) + 1);
      if (!in_degree.has(parent)) in_degree.set(parent, 0);
    });

    // 3. Group Nodes into Components (Independent Graphs)
    const components = this._getComponents(all_nodes, adj, valid_edges);
    const hierarchies = [];

    components.forEach((componentNodes) => {
      const componentAdj = new Map();
      const componentInDegree = new Map();
      
      componentNodes.forEach(node => {
        componentInDegree.set(node, in_degree.get(node) || 0);
        if (adj.has(node)) {
          componentAdj.set(node, adj.get(node).filter(child => componentNodes.has(child)));
        }
      });

      // Find Roots
      let roots = Array.from(componentNodes).filter(node => componentInDegree.get(node) === 0);
      let isCycle = false;
      let rootNode = "";

      if (roots.length === 0) {
        // Pure cycle
        isCycle = true;
        rootNode = Array.from(componentNodes).sort()[0];
      } else {
        // Sort roots lexicographically for consistency
        roots.sort();
        rootNode = roots[0];
        // Cycle detection within the group using Kahn's
        if (this._hasCycle(componentNodes, componentAdj, componentInDegree)) {
          isCycle = true;
        }
      }

      if (isCycle) {
        hierarchies.push({
          root: rootNode,
          tree: {},
          has_cycle: true
        });
      } else {
        const { tree, depth } = this._buildTree(rootNode, componentAdj);
        hierarchies.push({
          root: rootNode,
          tree: tree,
          depth: depth
        });
      }
    });

    // 4. Summary Generation
    const total_trees = hierarchies.filter(h => !h.has_cycle).length;
    const total_cycles = hierarchies.filter(h => h.has_cycle).length;
    
    let largest_tree_root = "";
    let max_depth = -1;

    hierarchies.forEach(h => {
      if (!h.has_cycle) {
        if (h.depth > max_depth) {
          max_depth = h.depth;
          largest_tree_root = h.root;
        } else if (h.depth === max_depth) {
          if (!largest_tree_root || h.root < largest_tree_root) {
            largest_tree_root = h.root;
          }
        }
      }
    });

    return {
      user_id: this.userId,
      email_id: this.emailId,
      enrollment_number: this.enrollmentNumber,
      hierarchies,
      invalid_entries,
      duplicate_edges,
      summary: {
        total_trees,
        total_cycles,
        largest_tree_root
      }
    };
  }

  _getComponents(nodes, adj, edges) {
    const visited = new Set();
    const components = [];
    
    // Build undirected graph for component finding
    const undirected = new Map();
    nodes.forEach(node => undirected.set(node, []));
    edges.forEach(({ parent, child }) => {
      undirected.get(parent).push(child);
      undirected.get(child).push(parent);
    });

    nodes.forEach(node => {
      if (!visited.has(node)) {
        const component = new Set();
        const stack = [node];
        visited.add(node);
        while (stack.length > 0) {
          const curr = stack.pop();
          component.add(curr);
          (undirected.get(curr) || []).forEach(neighbor => {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              stack.push(neighbor);
            }
          });
        }
        components.push(component);
      }
    });
    return components;
  }

  _hasCycle(nodes, adj, inDegreeMap) {
    const q = [];
    const inDegree = new Map(inDegreeMap);
    let count = 0;

    nodes.forEach(node => {
      if (inDegree.get(node) === 0) q.push(node);
    });

    while (q.length > 0) {
      const u = q.shift();
      count++;
      (adj.get(u) || []).forEach(v => {
        inDegree.set(v, inDegree.get(v) - 1);
        if (inDegree.get(v) === 0) q.push(v);
      });
    }

    return count !== nodes.size;
  }

  _buildTree(root, adj) {
    const tree = {};
    
    const traverse = (node) => {
      const children = adj.get(node) || [];
      const nodeObj = {};
      let maxChildDepth = 0;
      
      children.sort().forEach(child => {
        const { tree: childTree, depth: childDepth } = traverse(child);
        nodeObj[child] = childTree[child];
        maxChildDepth = Math.max(maxChildDepth, childDepth);
      });

      return {
        tree: { [node]: nodeObj },
        depth: 1 + maxChildDepth
      };
    };

    return traverse(root);
  }
}

module.exports = GraphProcessor;
