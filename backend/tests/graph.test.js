const GraphProcessor = require('../src/core/GraphProcessor');

describe('GraphProcessor Core Logic', () => {
  let processor;

  beforeEach(() => {
    processor = new GraphProcessor();
  });

  test('should handle a basic tree correctly', () => {
    const input = ["A->B", "A->C", "B->D"];
    const result = processor.process(input);
    
    expect(result.summary.total_trees).toBe(1);
    expect(result.hierarchies[0].root).toBe("A");
    expect(result.hierarchies[0].depth).toBe(3);
    expect(result.hierarchies[0].tree).toEqual({
      "A": {
        "B": { "D": {} },
        "C": {}
      }
    });
  });

  test('should detect cycles and return has_cycle: true', () => {
    const input = ["X->Y", "Y->Z", "Z->X"];
    const result = processor.process(input);
    
    expect(result.summary.total_cycles).toBe(1);
    expect(result.hierarchies[0].has_cycle).toBe(true);
    expect(result.hierarchies[0].tree).toEqual({});
  });

  test('should identify invalid entries', () => {
    const input = ["hello", "1->2", "A->A", "A->"];
    const result = processor.process(input);
    
    expect(result.invalid_entries).toContain("hello");
    expect(result.invalid_entries).toContain("1->2");
    expect(result.invalid_entries).toContain("A->A");
    expect(result.invalid_entries).toContain("A->");
  });

  test('should handle duplicate edges', () => {
    const input = ["A->B", "A->B"];
    const result = processor.process(input);
    
    expect(result.duplicate_edges).toContain("A->B");
    expect(result.summary.total_trees).toBe(1);
  });

  test('should follow first-parent rule for multi-parent nodes', () => {
    const input = ["A->D", "B->D", "B->E"];
    const result = processor.process(input);
    
    // A->D should win, B->D discarded, but B->E is valid
    const aTree = result.hierarchies.find(h => h.root === "A");
    const bTree = result.hierarchies.find(h => h.root === "B");
    
    expect(aTree.tree["A"]).toHaveProperty("D");
    expect(bTree.tree["B"]).toHaveProperty("E");
    expect(bTree.tree["B"]).not.toHaveProperty("D");
  });

  test('should use lexicographically smallest node as root for pure cycles', () => {
    const input = ["B->C", "C->B"];
    const result = processor.process(input);
    
    expect(result.hierarchies[0].root).toBe("B");
    expect(result.hierarchies[0].has_cycle).toBe(true);
  });
});
