using UnityEngine;

public class ExampleClass : MonoBehaviour
{
    private GameObject target;

    void Awake()
    {
        target = GameObject.FindWithTag("Player");
    }
}
