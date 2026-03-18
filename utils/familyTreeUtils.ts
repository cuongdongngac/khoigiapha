import { Person, Relationship } from "@/types";

export interface TreeNode {
  person: Person;
  children: TreeNode[];
  spouses: Person[];
  level: number;
}

export interface FamilyTreeData {
  persons: Map<string, Person>;
  relationships: Relationship[];
  roots: Person[];
  tree: TreeNode[];
  branches: any[];
}

/**
 * Build family tree structure from persons and relationships
 * Used by both FamilyTree, MindmapTree, and SimpleHTMLGenerator
 */
export function buildFamilyTreeData(persons: Person[], relationships: Relationship[], branches: any[] = []): FamilyTreeData {
  // Create person map for quick lookup
  const personsMap = new Map<string, Person>();
  persons.forEach(person => personsMap.set(person.id, person));

  // Find root persons (those without parents)
  const rootPersons = persons.filter(person => {
    const hasParents = relationships.some(rel => 
      (rel.type === "biological_child" || rel.type === "adopted_child") && 
      rel.person_b === person.id
    );
    return !hasParents;
  });

  // Build tree structure
  const buildTreeNode = (personId: string, visited: Set<string>, level: number = 0): TreeNode | null => {
    if (visited.has(personId)) return null;
    visited.add(personId);

    const person = personsMap.get(personId);
    if (!person) return null;

    // Find children
    const childRels = relationships.filter(rel => 
      (rel.type === "biological_child" || rel.type === "adopted_child") && 
      rel.person_b === personId
    );

    const children = childRels
      .map(rel => personsMap.get(rel.person_a))
      .filter((child): child is Person => child !== undefined)
      .map(child => buildTreeNode(child.id, new Set(visited), level + 1))
      .filter((node): node is TreeNode => node !== undefined) as TreeNode[];

    // Find spouses
    const spouseRels = relationships.filter(rel => 
      rel.type === "marriage" && 
      (rel.person_a === personId || rel.person_b === personId)
    );

    const spouses = spouseRels
      .map(rel => {
        const spouseId = rel.person_a === personId ? rel.person_b : rel.person_a;
        return personsMap.get(spouseId);
      })
      .filter(Boolean) as Person[];

    return {
      person,
      children: children.sort((a, b) => (a.person.birth_order || 0) - (b.person.birth_order || 0)),
      spouses,
      level
    };
  };

  // Build complete tree from all roots
  const tree: TreeNode[] = rootPersons.map(root => 
    buildTreeNode(root.id, new Set<string>(), 0)
  ).filter(Boolean) as TreeNode[];

  return {
    persons: personsMap,
    relationships,
    roots: rootPersons,
    tree,
    branches
  };
}

/**
 * Generate HTML for simple family tree
 */
export function generateSimpleFamilyTreeHTML(tree: TreeNode[], branches: any[] = []): string {
  const generatePersonHTML = (node: TreeNode): string => {
    const person = node.person;
    const generation = person.generation || node.level + 1;
    
    // Get branch name
    const branch = branches.find((b) => b.id === person.branch_id);
    const branchName = branch?.name ?? null;
    
    return `
      <div class="person ${person.gender}" onclick="toggleChildren(this)">
        <span class="toggle">▼</span>
        <div class="person-info">
          ${branchName ? `<div class="generation">${branchName} - Đời thứ ${generation}</div>` : `<div class="generation">Đời thứ ${generation}</div>`}
          <h3>${person.full_name}</h3>
          ${person.birth_year ? `<p>Sinh năm: ${person.birth_year}</p>` : ''}
          ${person.gender ? `<p>Giới tính: ${person.gender === 'male' ? 'Nam' : 'Nữ'}</p>` : ''}
          ${person.other_names ? `<p>Tên khác: ${person.other_names}</p>` : ''}
          ${node.spouses && node.spouses.length > 0 ? `<p class="spouse-info"><strong>Vợ/chồng:</strong> ${node.spouses.map(s => s.full_name).join(', ')}</p>` : ''}
        </div>
        </div>
        ${node.children && node.children.length > 0 ? `
          <div class="children">
            ${node.children.map((child: TreeNode) => generatePersonHTML(child)).join('')}
          </div>
        ` : ''}
      `;
  };

  const generateTreeHTML = (nodes: TreeNode[]): string => {
    return nodes.map((node: TreeNode) => generatePersonHTML(node)).join('');
  };

  return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <title>Gia Phả - ${new Date().toLocaleDateString('vi-VN')}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: #f5f5f4; 
            line-height: 1.6;
        }
        .person { 
            margin: 20px 0; 
            padding: 15px; 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            background: white; 
            cursor: pointer; 
            position: relative;
        }
        .person:hover { 
            background: #f9fafb; 
        }
        .person-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            margin-bottom: 10px; 
        }
        .person-info { 
            flex: 1; 
        }
        .generation { 
            background: #f0f0f0; 
            padding: 5px 10px; 
            border-radius: 4px; 
            font-weight: bold; 
            display: inline-block; 
            margin-bottom: 5px; 
        }
        .branch-line { 
            color: #666; 
            font-size: 0.9em; 
            margin-bottom: 5px; 
            font-style: italic; 
        }
        .children { 
            margin-left: 40px; 
            border-left: 2px solid #ccc; 
            padding-left: 20px; 
            margin-top: 10px;
        }
        .children.collapsed { 
            display: none; 
        }
        .toggle { 
            float: right; 
            font-size: 18px; 
            color: #666; 
            cursor: pointer;
            user-select: none;
        }
        .female { 
            background: #fef3f2; 
            border-color: #fca5a5; 
        }
        .male { 
            background: #f0f9ff; 
            border-color: #93c5fd; 
        }
        .controls { 
            text-align: center; 
            margin: 20px 0; 
        }
        .btn { 
            padding: 10px 20px; 
            margin: 0 10px; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            background: #3b82f6; 
            color: white; 
        }
        .btn:hover { 
            background: #2563eb; 
        }
        .btn.secondary { 
            background: #6b7280; 
        }
        .btn.secondary:hover { 
            background: #4b5563; 
        }
        @media print { 
            .controls { display: none; } 
            .children.collapsed { display: block !important; } 
        }
    </style>
</head>
<body>
    <h1>Gia Phả - Sơ Đồ Tư Duy</h1>
    <div class="controls">
        <button class="btn" onclick="expandAll()">Mở tất cả</button>
        <button class="btn secondary" onclick="collapseAll()">Đóng tất cả</button>
        <button class="btn" onclick="window.print()">In ấn</button>
    </div>
    <div id="family-tree">
        ${generateTreeHTML(tree)}
    </div>
    <script>
        function toggleChildren(element) {
            const children = element.nextElementSibling;
            const toggle = element.querySelector('.toggle');
            
            if (children && children.classList.contains('children')) {
                if (children.classList.contains('collapsed')) {
                    children.classList.remove('collapsed');
                    toggle.textContent = '▼';
                } else {
                    children.classList.add('collapsed');
                    toggle.textContent = '▶';
                }
            }
        }
        
        function expandAll() {
            document.querySelectorAll('.children.collapsed').forEach(child => {
                child.classList.remove('collapsed');
                const parent = child.previousElementSibling;
                const toggle = parent.querySelector('.toggle');
                if (toggle) toggle.textContent = '▼';
            });
        }
        
        function collapseAll() {
            document.querySelectorAll('.children').forEach(child => {
                child.classList.add('collapsed');
                const parent = child.previousElementSibling;
                const toggle = parent.querySelector('.toggle');
                if (toggle) toggle.textContent = '▶';
            });
        }
        
        // Auto-expand first 2 levels
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.person').forEach((person, index) => {
                const generationText = person.querySelector('.generation').textContent;
                const generation = parseInt(generationText.replace('Đời thứ ', '').replace('N/A', '0'));
                if (generation <= 2) {
                    const children = person.nextElementSibling;
                    const toggle = person.querySelector('.toggle');
                    if (children && children.classList.contains('children') && toggle) {
                        children.classList.remove('collapsed');
                        toggle.textContent = '▼';
                    }
                }
            });
        });
    </script>
</body>
</html>`;
}
