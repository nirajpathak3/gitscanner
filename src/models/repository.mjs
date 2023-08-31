class Repository {
    constructor(name, size, owner, isPrivate, numFiles, ymlContent, activeWebhooks) {
        this.name = name;
        this.size = size;
        this.owner = owner;
        this.isPrivate = isPrivate;
        this.numFiles = numFiles;
        this.ymlContent = ymlContent;
        this.activeWebhooks = activeWebhooks;
    }
}

export{ Repository };