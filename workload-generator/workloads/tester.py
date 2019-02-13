with open("test.txt") as f:
    content = f.readlines()

content = [x.strip("|") for x in content]
content = [x.strip("\n") for x in content]
content = [x.strip() for x in content]
content = [x.strip("|") for x in content]
content = [int(x) for x in content]
content = sorted(content)


def find(arr):
        for x in range(0,len(arr) -1):
                if arr[x+1] - arr[x] != 1:
                        print(arr[x] + 1)



find(content)
print(len(content))
